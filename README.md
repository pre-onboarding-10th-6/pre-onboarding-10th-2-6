# Week: 검색어 추천 / 캐싱

## 검색어 추천

### debounce

```tsx
useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>

  const debounceSearch = debounce(() => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      search(keyword)
    }, 1000)
  }, 500)

  debounceSearch()

  return () => {
    clearTimeout(timeoutId)
    debounceSearch.cancel()
  }
}, [keyword])
```

코드는 React의 useEffect 훅을 사용하여 keyword가 변경될 때마다 디바운스된 검색 함수를 실행하고, 컴포넌트가 unmount될 때 디바운스된 검색 함수와 타임아웃을 취소하는 코드입니다.

여기서 debounce 함수는 검색 함수를 감싸는 debounce 함수입니다. 이 함수는 지연된 검색 함수를 생성하며, 검색어 입력 중이면 기존의 지연 검색 함수를 취소하고 새로운 지연 검색 함수를 생성합니다. 이렇게 함으로써 검색어 입력이 지속될 때마다 검색 함수가 실행되는 것을 방지할 수 있습니다.

timeoutId는 검색 함수를 지연시키는 타이머의 ID를 저장합니다. clearTimeout 함수를 사용하여 이 타이머를 취소하면 검색 함수가 즉시 실행됩니다.

debounceSearch 함수는 debounce 함수에 의해 생성된 함수입니다. 이 함수를 실행하면, 검색어 입력 후 500ms가 경과하면 검색 함수가 실행됩니다. 이 때, 기존의 검색 함수를 취소하고 새로운 검색 함수를 생성합니다.

마지막으로, useEffect 함수는 컴포넌트가 unmount될 때 timeoutId와 debounceSearch 함수를 취소하는 cleanup 함수를 반환합니다. 이렇게 함으로써 메모리 릭을 방지하고, 컴포넌트의 불필요한 렌더링을 막을 수 있습니다.

> 구현하는 동안 debounce에 대한 이해가 적어서 사실 에러가 안나는 방식으로 구현한 것이라서 아쉬움이 남습니다..

### search 함수

```tsx
const search = async (word: string) => {
  if (keyword !== '') {
    const findResult = await findCache(word)
    if (findResult) {
      setResults(findResult)
    } else {
      try {
        const response = await searchAPI(word)
        const data = response.data
        if (response && response.status === 200) {
          setResults(data)
          await saveCache({ word, data })
          console.info('calling api')
        } else {
          throw new Error(`Unexpected response status ${response?.status}`)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
```

findCache 함수를 호출하여, 캐시에서 검색어에 해당하는 결과를 찾습니다.
만약 캐시에서 결과를 찾은 경우, setResults 함수를 사용하여 화면에 결과를 표시합니다.
만약 캐시에서 결과를 찾지 못한 경우, searchAPI 함수를 호출하여 API로 요청을 보냅니다.
요청이 성공적으로 반환되면, setResults 함수를 사용하여 결과를 화면에 표시합니다.
동시에, saveCache 함수를 사용하여 검색어와 결과를 로컬 캐시에 저장합니다.
만약 요청이 성공하지 못한 경우, console.error 함수를 사용하여 에러를 출력합니다.

## Cache Storage API

```TSX
import { SearchData } from '../App'

interface saveCacheRequest {
  word: string
  data: SearchData[]
}
export const saveCache = async ({ word, data }: saveCacheRequest) => {
  try {
    const cache = await caches.open('my-cache')
    const response = new Response(JSON.stringify(data), {
      headers: { 'Cache-Control': 'max-age=30' }
    })
    await cache.put(word, response)
    if (!response.ok) {
      throw new Error(`Unexpected response status ${response.status}`)
    }
  } catch (error) {
    console.error('Error adding data to cache', error)
  }
}

export const findCache = async (word: string) => {
  try {
    const cache = await caches.open('my-cache')
    const response = await cache.match(word)

    if (response && response.status === 200) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

```

따로 분리해서 관리하였습니다.

코드 만료를 위한 함수를 작성했었으나 계속 꼬여서 삭제했습니다...
저는 search API 에서 Cache-Control을 작성하면 캐시 스토리지에서 제대로 반영이 되지 않길래 아예 cache API에서 헤더로 직접 주었습니다. 30초인 이유는 만료된 코드 삭제하는 함수 테스트를 위해 짧게 잡은 것으로 보입니다.

캐시 만료기능과 추천 검색어 키보드 이동 기능은 구현하지 못하였습니다.
