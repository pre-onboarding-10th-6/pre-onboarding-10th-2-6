![화면 캡처 2023-05-04 114257](https://user-images.githubusercontent.com/22536999/236099790-205e00e4-d075-4101-b7b9-49250f455e1c.png)

<br />

## 컴포넌트 구조

![화면 캡처 2023-05-04 123746](https://user-images.githubusercontent.com/22536999/236107541-1567fc3b-d107-442e-8d25-15ee25b292bf.png)

<br />

## API 호출 구현

- API 호출 함수 구현 - 사용할 url이 하나뿐이라 따로 분리하지는 않음

```ts
// api/search.ts
export const getSuggestions = (name: string): Promise<Suggestion[]> =>
  instance.get('api/v1/search-conditions/', { params: { name } })
```

- API 호출 확인 - axios interceptors 사용하여 매 호출마다 로그 출력

```ts
// api/index.ts
instance.interceptors.request.use(config => {
  console.info('calling api')
  return config
})
```

<br />

## API 호출 횟수 조절

- Debounce 사용

```ts
// hooks/useDebounce.ts
const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
```

입력값(검색어)이 변경될 때마다 250ms delay로 debounce된 값을 생성한다.

즉, `debouncedKeyword`가 변경될 때마다 캐시 로직을 실행하면 된다.

```ts
// components/Search.tsx
const { value: keyword, setValue: setKeyword, handleChange } = useInput('')
const debouncedKeyword = useDebounce<string>(keyword, 250)
```

<br />

## 웹 스토리지 비교

1. SessionStorage

- 탭의 수명으로 범위가 한정
- 동기식이며 메인 스레드를 차단
- 약 5MB로 제한되며 문자열만 포함 가능

2. LocalStorage

- 동기식이며 메인 스레드를 차단
- 약 5MB로 제한되며 문자열만 포함 가능

3. CacheStorage

- 비동기식이며 메인 스레드를 차단하지 않음
- 적어도 수백 MB, 경우에 따라 수 GB 이상, 일반적으로 장치에서 사용 가능한 저장 공간의 양에 따라 결정됨

![화면 캡처 2023-05-04 122519](https://user-images.githubusercontent.com/22536999/236106153-07748122-1832-41a1-b4d9-55cb6a501515.png)

<br />

## 로컬 캐싱

cacheStorage 사용

- cache key 값이 변경될 때마다 캐시를 체크한다.
- 캐시 만료 일자가 없으면 해당 캐시를 그냥 사용한다.

```ts
// hooks/useCache.ts
interface UseCacheProps<T> {
  initialData: T
  name: string
  key: string
  duration: number
  fetchData: (name: string) => Promise<T>
}

const useCache = <T>({
  initialData,
  name,
  key,
  duration,
  fetchData
}: UseCacheProps<T>) => {
  const [cachedData, setCachedData] = useState(initialData)

  useEffect(() => {
    const fetch = async () => {
      const cacheStorage = await caches.open(name)
      const newData = await fetchData(key)

      await cacheStorage.put(
        key,
        new Response(JSON.stringify(newData), {
          headers: {
            Expires: getExpirationDate(duration)
          }
        })
      )

      setCachedData(newData)
    }

    const checkCache = async () => {
      try {
        const cacheStorage = await caches.open(name)
        const cache = await cacheStorage.match(key)

        if (!cache) {
          fetch()
          return
        }

        const expires = cache.headers.get('Expires')

        if (!expires) {
          setCachedData(await cache.json())
          return
        }

        const expiresDate = new Date(expires)
        const currentDate = new Date()
        expiresDate <= currentDate ? fetch() : setCachedData(await cache.json())
      } catch (error) {
        console.error(error)
      }
    }

    key ? checkCache() : setCachedData(initialData)
  }, [key])

  return { cachedData }
}
```

- 사용 예시

```ts
// components/Search.tsx
const { cachedData: suggestions } = useCache<Suggestion[]>({
  initialData: [],
  name: CACHE_SUGGESTIONS,
  key: debouncedKeyword,
  duration: CACHE_DURATION,
  fetchData: getSuggestions
})
```

<br />

## 키보드 이동

키보드 이동 관련 요구 사항이 명확하지 않아서 모듈화하지는 않음 (방향키 이동 정도는 괜찮을지도)

````ts
// components/Search.tsx
switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex < lastIndex ? prevIndex + 1 : 0))
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : lastIndex))
        break
      }
      case 'Escape': {
        setFocusIndex(-1)
        break
      }
      case 'Enter': {
        focusIndex > -1 && setKeyword(suggestions[focusIndex].name)
        break
      }
      default: {
        break
      }
    }
    ```
````
