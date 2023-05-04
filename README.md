# 프리온보딩 과제 (1) 👫

<br/><br/>

## 목표

- 검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현

<br/><br/>

## 세부 구현 사항

<br/><br/>

## API 호출별로 로컬 캐싱 구현

```javascript
const useSearchHandler = (searchKeyword: string) => {
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  const debouncedValue = useDebounce(searchKeyword)
  const BASE_URL = `/?name=${debouncedValue}`
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function handleSearch() {
      setLoading(true)
      const cacheStorage = await caches.open('search')
      const cachedData = await cacheStorage.match(BASE_URL)
      try {
        if (cachedData) {
          const res = await cachedData.json()
          setResult(res)
        } else {
          const res = await searchAPI(debouncedValue)
          console.info('calling api')
          cacheStorage.put(BASE_URL, new Response(JSON.stringify(res.data)))
          setResult(res.data)
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    handleSearch()
  }, [debouncedValue])

  return { result, loading }
}
```

위의 코드를 보면, useDebounce라는 커스텀 훅을 사용하여 입력된 searchKeyword를 디바운스 처리한다. 검색어를 입력할 때마다 매번 API 요청을 보내는 것이 아니라 일정 시간 후에 마지막으로 입력된 검색어를 기반으로 API 요청을 보낸다.
이때 캐시 저장소를 사용하여 이전에 요청한 검색어의 결과를 저장하고, 동일한 검색어가 입력될 때 API 요청 대신 캐시된 데이터를 사용한다. 캐시 저장소를 사용한 이유는 대규모의 데이터를 다루는 데에 적합하고, 검색 결과와 같이 자주 변경되지 않는 데이터를 캐싱하는데 효과적이기 때문이다.

<br/><br/>

## expire time 구현 (리팩토링)

  <br/>
  캐시가 많이 쌓이게 되면 그만큼 캐시 내부에서 데이터를 찾는 시간이 늘어나 오히려 성능 측면에서 좋지 않다. 때문에 캐시된 응답이 5분 동안 유효하도록 하였다.

```javascript
instance.get(`/?name=${debouncedValue}`, {
  headers: {
    'Cache-Control': 'max-age=300'
  }
})
```

<br/><br/>

## API 호출 횟수 줄이는 전략 수립 및 실행

```javascript
export const useDebounce = (value: any, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  })

  return debouncedValue
}
```

input 이벤트가 발생할 때마다 타이머를 설정한다. 300ms동안 입력이 없으면 입력이 끝난 것으로 간주한다. 300ms 이전에 타자 입력이 발생하면 이전 타이머는 취소하고 새로운 타이머를 다시 설정한다. useDebounce 훅을 사용하여 value가 변경될 때마다 디바운스를 적용하고 debouncedValue 값을 업데이트한다. 일정 시간 후에 value를 debouncedValue로 업데이트하고, clearTimeout 함수를 사용하여 이전 setTimeout 실행을 취소시킨다.

<br/><br/>

## 키보드만으로 추천 검색어 이동

```javascript
const useKeyHandler = (result: any): any => {
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const handleKeyUpDown: any = (event: React.KeyboardEvent) => {
    const { key } = event

    switch (key) {
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIdx((prev: any) => {
          if (prev === -1) {
            return result.length - 1
          }
          return Math.max(prev - 1, 0)
        })
        break
      case 'ArrowDown':
        event.preventDefault()
        if (selectedIdx === 5) {
          setSelectedIdx(0)
        } else {
          console.log(result.length - 1)
          setSelectedIdx((prev: any) => Math.min(prev + 1, result.length))
        }
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIdx >= 0) {
          console.log(`${result[selectedIdx].name}`)
        }
        break
      default:
        break
    }
  }

  return { handleKeyUpDown, selectedIdx }
}
```

커스텀 훅 useKeyHandler을 사용하여 키보드의 방향키로 이동 가능하다. selectedIdx는 현재 선택된 항목의 인덱스를 저장하고, 초기값으로 -1을 가진다. handleKeyUpDown 함수는 event 객체를 매개변수로 받아 키보드 이벤트 정보를 추출한다. 각각의 이벤트 조건에 따라 selectedIdx 값을 변화시킨다.

또한, ArrowDown 키가 눌린 상태이고 현재 선택된 항목이 마지막 항목이라면(selectedIdx === 5), 첫번째 항목을 선택할 수 있게 한다. 엔터키가 눌리면,해당 인덱스의 name 속성값을 콘솔에 출력한다.
