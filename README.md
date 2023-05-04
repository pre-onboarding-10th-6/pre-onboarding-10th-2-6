# 원티트 기업과제 1번째

기업명, api주소 등 노출 x

## 구현과제

### API 호출별로 로컬 캐싱 구현

기본구현은 `Cache Storage API`를 이용해서 구현했습니다.

**만료기간구현**

만료됐는지 계산하려면 저장했을 때의 시간을 저장 할 필요가 있었습니다.
api 반환값을 `key`에 저장할 때 `timestamp`값을 저장한 `keyword + timestamp`의 `key`값을 같이 저장하는 방법을 사용했습니다.

isCacheExpired 함수를 `정의해서 현재시간 - cache를 저장할 때의 시간 > 정의한 캐시 만료 시간`을 계산하고 결과를 `boolean`으로 반환하도록 했습니다.

```typescript
const isCacheExpired = async (
  cache: Cache,
  keyword: string
): Promise<boolean> => {
  const timestampResponse = await cache.match(`${keyword}_timestamp`)
  if (!timestampResponse) return false

  const timestampText = await timestampResponse.text()
  const cachedTime = parseInt(timestampText)
  const currentTime = Date.now()
  const isExpired = currentTime - cachedTime > cacheTtl

  return isExpired
}
```

searchWithCache 함수는 호출 후 `isCacheExpired`가 `false`(만료X)면 저장된 캐시데이터를 반환합니다.
캐시데이터가 있을 경우를 데이터를 선반환하도록 했고 나머지는 캐시데이터가 없을 경우 저장 과정을 수행하게 했습니다.

```typescript
export const searchWithCache = async function (
  keyword: string
): Promise<ResultItem[]> {
  const cache = await caches.open(cacheName)

  // 만료된 cache 삭제
  await clearExpiredCache(cache)

  const cachedResponse = await cache.match(keyword)
  const timestampResponse = await cache.match(`${keyword}_timestamp`)

  // Cache가 있고, 만료되지 않은 경우 바로 저장된 데이터를 반환합니다.
  if (cachedResponse && !(await isCacheExpired(cache, keyword))) {
    return cachedResponse.json()
  }

  const response = await getSearchKeyword(`${keyword}`)
  // cache.put의 2번째 매개변수는 Response 객체여야하는데 여기선 axiosResponse로 반환값을 받아오기 때문에 new Response를 사용해 바꿔주지 않으면 에러가 나게 됩니다.
  const responseForCache = new Response(JSON.stringify(response.data))

  await cache.put(keyword, responseForCache)

  // timestamp가 없거나 만료된 경우, 새로운 timestamp를 생성
  if (!timestampResponse || (await isCacheExpired(cache, keyword))) {
    const timestamp = new Response(Date.now().toString())
    await cache.put(`${keyword}_timestamp`, timestamp)
  }

  return response.data
}
```

cache 데이터가 timestamp까지 너무 많이 저장되는 것 같아서 요청할 때 전체 캐시 데이터를 검사해서 만료된 캐시 데이터를 삭제하도록 clearExpiredCache 함수를 작성해서 사용했습니다.

```typescript
const clearExpiredCache = async (cache: Cache): Promise<void> => {
  const keys = await cache.keys()

  const checkCaches = keys.map(async key => {
    const keyword = key.url
    const isExpired = await isCacheExpired(cache, keyword)
    return isExpired ? keyword : null
  })

  const expiredCaches = (await Promise.all(checkCaches)).filter(
    data => data !== null
  ) as string[]

  const deleteCaches = expiredCaches.map(async key => {
    await cache.delete(key)
    await cache.delete(`${key}_timestamp`)
  })

  await Promise.all(deleteCaches)
}
```

만료기간을 60초로 설정했을 때 생각으로 만들었는데 cache 만료기간이 길다면 캐시 개수를 제한하고 초과할 때 가장 오래된 캐시 데이터부터 삭제하는 방법을 사용할 수 있을 것 같습니다.

- 캐시기능을 구현하는데 참고한 링크
  - https://web.dev/cache-api-quick-guide/
  - [velog블로그](https://velog.io/@skyu_dev/Cache-API-%EC%84%9C%EB%B2%84-%EC%9D%91%EB%8B%B5response%EC%9D%98-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EC%BA%90%EC%8B%B1%ED%95%98%EC%97%AC-%EB%B6%88%ED%95%84%EC%9A%94%ED%95%9C-%EC%9A%94%EC%B2%AD%EC%9D%84-%EC%A4%84%EC%97%AC%EB%B3%B4%EC%9E%90)

### 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행

searchbar컴포넌트의 input onChange로 내용이 변할 때 마다 호출하도록 구현했는데 1차적으로 이전 값과 다를 경우에만 호출하도록 구현했고 2차적으로 lodash라이브러리의 debounce를 사용해서 정의된 DELAY_TIME마다 1번씩 호출되도록 했습니다.
추가로 빈값을 요청하면 에러를 반환하기 때문에 공백이 아닐때만 요청하도록 했습니다.

```typescript
const handleSearchBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newKeyword = e.target.value
  setKeyword(prevKeyword => {
    if (prevKeyword !== newKeyword) {
      sendRequest(newKeyword)
    }
    return newKeyword
  })
}
```

```typescript
const sendRequest = useCallback(
  _.debounce(async (req: string) => {
    if (req.trim() !== '') {
      console.log(`Sending request with query: ${req}`)
      const searchResultData = await searchWithCache(req)
      setSearchResults(searchResultData)
    } else {
      setSearchResults([])
    }
  }, DELAY_TIME),
  []
)
```

### 키보드만으로 추천 검색어들로 이동 가능하도록 구현

input부분과 추천검색어 부분의 부모 태그인 section에 onFocus, onBlur이벤트를 사용해서 다른 부분으로 이동하거나 클릭하면 추천검색어 부분이 언마운트 되도록 구현했습니다.

```typescript
<MainSection onFocus={handleSearchbarFocus} onBlur={handleSearchbarBlur}>
  <Searchbar keyword={keyword} onChange={handleSearchBarChange} />
  {isSearchbarFocused && (
    <KeywordList results={searchResults} onClick={handleKeywordListClick} />
  )}
</MainSection>
```

```typescript
const handleSearchbarBlur = (e: React.FocusEvent<HTMLDivElement>) => {
  // 현재 target이 자식요소인지 확인
  if (!e.currentTarget?.contains(e.relatedTarget as Node)) {
    setIsSearchbarFocused(false)
  }
}
```

위, 아래, tab, enter의 키보드 이동부분을 useKeyboardNavigation 훅으로 분리해서 구현했습니다.

```typescript
length: number,
onClick: (index: number) => void
```

length로 사용할 배열의 길이를 받아오고 해당 항목을 선택했을 때 호출되는 함수를 인자로 받습니다.
`const [selectedIndex, setSelectedIndex] = useState(0)`
selectedIndex 값으로 이벤트마다 값을 변경해주고 있습니다.

```typescript
const useKeyboardNavigation = (
  length: number,
  onClick: (index: number) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault()
          if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
          }
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (selectedIndex < length - 1) {
            setSelectedIndex(selectedIndex + 1)
          }
          break
        }
        case 'Tab':
          e.preventDefault()
          if (selectedIndex < length - 1) {
            setSelectedIndex(selectedIndex + 1)
          }
          break
        case 'Enter': {
          onClick(selectedIndex)
          break
        }
        default:
          break
      }
    },
    [selectedIndex, setSelectedIndex, length, onClick]
  )

  return { selectedIndex, handleKeyDown }
}

export default useKeyboardNavigation
```

### 삽질한 부분

- section 태그에 onFocus, onBlur를 등록했는데 자식컴포넌트에서 tab으로 이동하는데도 blur이벤트가 발생해서 애먹었는데 target이 자식요소인지 확인하는 조건이 필요했음
  [https://legacy.reactjs.org/docs/events.html#onfocus]

- 캐쉬만료기간 계산할 때 ms 생각해서 60 \* 1000 처럼 1000을 곱해줬어야 했는데 빼먹고 삽질
- SearchBar에서 KeywordList으로 방향키나 탭을 누르면 바로 이동하게 구현하는 부분
