# 캐싱

브라우저 cache API와 cache stroage를 이용하여 구현.

## 1. 캐시 Expiration

API 호출 전 캐시스토리지에 만료된 캐시가 있는지를 확인하고 있으면 삭제한다.

캐시 유효기간은 캐싱할 때 HTTP Header에 설정된 date, max-age값을 기반으로 현재 시간과 비교하여 만료 여부를 판단한다.

```typescript
export const removeExpiredCache = async (
  cache: Cache,
  keys: readonly Request[]
) => {
  if (keys.length) {
    await Promise.all(
      keys.map(async request => {
        const response = await cache.match(request)
        if (response && isExpired(response)) {
          await cache.delete(request)
        }
      })
    )
  }
}
```

## 2. 캐싱

URL을 기준으로 fetch HTTP Request를 보내어 캐싱한다.

URL과 cache stroage name만 별도로 지정하면 재사용 가능한 캐싱 함수.

cache storage에 캐싱 여부를 판단하고 캐싱되어 있으면 해당 값을 사용하고, 캐싱되어 있지 않으면 새 API를 호출하고 캐싱한다.

- API 호출 횟수 카운트는 렌더링간에도 휘발되지 않는 값인 useRef 활용

```typescript
const apiCallCnt = useRef(0)

export const fetchData = async (
  cache: Cache,
  URL: string,
  cnt: React.MutableRefObject<number>
): Promise<SearchData[]> => {
  const existingCache = await cache.match(URL)
  if (existingCache) {
    return existingCache.json()
  }

  const response = await fetch(URL)
  const responseWithHeader = getNewResponse(response.clone())
  await cache.put(URL, responseWithHeader)

  console.info(`Search API 호출 횟수 : ${(cnt.current += 1)}`)
  return await response.json()
}
```

# 입력 API 호출 제한

input onChange Handler 내부에 디바운싱을 구현.

```typescript
const debounceRef = useRef<NodeJS.Timeout | null>(null)

const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchState({ ...searchState, input: e.target.value })

  if (debounceRef.current !== null) clearTimeout(debounceRef.current)

  debounceRef.current = setTimeout(async () => {
    setSearchState({
      input: e.target.value,
      result: await searchAndGetResult(e.target.value)
    })
  }, 200)
}
```

useDebouncer custom hook을 구현하여 재사용 가능하게 작성하는 것을 생각해보았으나, custom hook에 사용되는 useEffect 때문에 실행흐름 파악이 복잡해진다고 판단.

좋은 방법 없을지?

```typescript

const debouncedValue = useDebouncer(searchState.input, 200);

useEffect(() => {
  const fetch = async () => {
    setSearchState({
      input: debouncedValue,
      result: await searchAndGetResult(debouncedValue)
    })
  }
  fetch()
}, [debouncedValue])


const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchState({ ...searchState, input: e.target.value })
}

-----------------

import { useState, useEffect } from 'react'

const useDebouncer = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebouncer


```

# 키보드 조작

키보드 방향키로 검색 아이템을 오고갈 수 있고 엔터 입력시 검색 API 호출

```typescript
const onKeyDownHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!searchItemCnt.current) return

  const maxIdx = searchItemCnt.current.childElementCount - 1
  const { key } = e
  const breakAndSubmit =
    key === 'Enter' &&
    (searchState.input.length === 0 ? focusedItem === -1 : focusedItem <= 0)

  if (breakAndSubmit) return

  if (key === 'ArrowUp') {
    setFocusedItem(prev => (prev === -1 ? maxIdx - 1 : prev - 1))
  } else if (key === 'ArrowDown') {
    setFocusedItem(prev => (prev === maxIdx - 1 ? -1 : prev + 1))
  } else if (key === 'Enter') {
    e.preventDefault()
    const autoSearch =
      searchState.input.length === 0
        ? JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)[
            focusedItem
          ]
        : searchState.result[focusedItem - 1].name

    setRecentKeywords(autoSearch)
    setSearchState({
      result: await searchAndGetResult(autoSearch),
      input: autoSearch
    })
    setFocusedItem(-1)
  }
}
```

Mouse로 검색 아이템 클릭시 검색 API 호출

단점) 클릭한 이벤트의 DOM 구조에 상당히 의존적이다. 좋은 방법 없을지?

```typescript

  const onMouseDownHandler = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const { currentTarget } = event
    const titleElement = currentTarget.childNodes[1] as HTMLElement
    const subtitleElement = currentTarget.childNodes[2] as
      | HTMLElement
      | undefined

    const title = titleElement?.textContent?.trim() ?? ''
    const subTitle = subtitleElement?.textContent?.trim() ?? ''

    const search = `${title} ${subTitle}`.trim()

    if (search.length > 0) {
      setRecentKeywords(search)
      setSearchState({
        result: await searchAndGetResult(search),
        input: search
      })
    }

```
