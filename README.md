# 기업 과제 1 - 검색창+검색어 추천+캐싱 기능
![](https://velog.velcdn.com/images/ssori0421/post/f605194f-5063-4a7b-be16-ba7744453db6/image.png)

## 1. 로컬 캐싱 구현

```typescript
// src > assets > config.ts
export const CACHE_KEY = 'cacheData'
export const CACHE_DURATION = 1000 * 60 * 5
```
캐시 키, 캐시 만료 시간(5분) 설정


```typescript
// src > util > getExpireDate.ts
export const getExpireDate = (cacheTime: number) => {
  const currentDate = new Date()
  const expirationDate = new Date(currentDate.getTime() + cacheTime)
  return expirationDate.toUTCString()
}
```
#### 'getExpireDate()'
  1. 현재 날짜와 시간을 나타내는 currentDate 객체를 생성. 
  2. currentDate.getTime() 메서드를 사용해 현재 날짜와 시간을 밀리초로 변환한 후, cacheTime을 더하고 새로운 Date 객체를 생성. 
  3. expirationDate.toUTCString() 메서드를 사용해 만료 시간를 UTC 문자열로 변환해 반환. 

```typescript
// src > service > getDisease.tsx
const isCacheValid = (cachedStorageData: Response) => {
  const expired = cachedStorageData.headers.get('expire_date')

  if (expired) {
    const currentDate = new Date()
    const expiredDate = new Date(expired)
    return currentDate <= expiredDate
  }
  return false
}

 const fetchDiseaseFromCache = async (cacheStorage: Cache, str: string) => {
  const cachedStorageData = await cacheStorage.match(str)

  if (cachedStorageData && isCacheValid(cachedStorageData)) {
    return cachedStorageData.json()
  }

  return null
} 

const fetchDiseaseFromAPI = async (
  str: string,
  cacheStorage: Cache
): Promise<IDisease[]> => {
  try {
    const { data }: { data: IDisease[] } = await instance.get(
      `search-conditions/?name=${str}`
    )
    const cachedData = new Response(JSON.stringify(data), {
      headers: {
        expire_date: getExpireDate(CACHE_DURATION)
      }
    })
    await cacheStorage.put(str, cachedData)
    return data
  } catch (error) {
    throw error
  }
}

const getDisease = async (str: string) => {
  const cacheStorage = await caches.open(CACHE_KEY)
  const cachedData = await fetchDiseaseFromCache(cacheStorage, str)

  if (cachedData) {
    return cachedData
  } else {
    return fetchDiseaseFromAPI(str, cacheStorage)
  }
}
```
#### 'isCacheValid()'
  1.  캐시된 응답의 헤더에서 만료 시간 값을 가져옴.
  2.  현재 시간이 만료 시간 이전이면 true를 반환.
#### 'fetchDiseaseFromCache()'
  1. cacheStorage.match(str)을 사용하여 주어진 질병 이름에 대한 캐시된 데이터를 가져옴.
  2. 캐시된 데이터가 존재하고, 캐시가 유효한 경우, 캐시된 데이터를 JSON 형식으로 반환.
  3. 캐시된 데이터가 없거나 캐시가 만료된 경우, null을 반환.
#### 'fetchDiseaseFromAPI()'
  1. instance.get() 메서드를 사용해 주어진 질병 이름에 해당하는 데이터를 API에서 가져와서 data 변수에 저장.
  2. 가져온 데이터를 JSON 문자열로 변환한 후, 새로운 Response 객체를 생성하고 만료 날짜를 헤더에 설정함. getExpireDate 함수를 사용하여 만료 시간 계산.
  3. cacheStorage.put() 메서드를 사용하여 질병 이름(str)을 키로 하여 캐시 데이터를 저장.

#### 'getDisease()'
  1. caches.open() 메서드를 사용하여 주어진 캐시 키(CACHE_KEY)에 대한 캐시 스토리지를 열어서, 이를 cacheStorage 변수에 저장.
  2. fetchDiseaseFromCache() 함수를 호출해 캐시 스토리지에서 주어진 질병 이름(str)에 해당하는 데이터를 가져옴. 가져온 데이터를 cachedData 변수에 저장.
  3. 캐시된 데이터가 존재하면 캐시된 데이터를 반환.
  4. 캐시된 데이터가 없거나 유효하지 않은 경우, fetchDiseaseFromAPI() 함수를 호출하여 API에서 주어진 질병 이름(str)에 해당하는 데이터를 가져와서 데이터를 반환.



## 2. Event 최적화
  키보드 입력마다 API가 호출되는 것을 방지하기 위해 debounce 적용
  'useDebounce()' 커스텀 훅 사용

```typescript
// src > hooks > useDebounce.ts
export const useDebounce = (value: string, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState<string>('')

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(value)
    }, delay)
    return () => {
      clearTimeout(id)
    }
  }, [value])
  return debounceValue
}
```
#### 'useDebounce()' 커스텀 훅
  1. debounceValue 라는 state 생성.
  2. useEffect hook을 사용하여 state가 변경될 때마다 debounce 처리를 수행함. 이때, delay 기본값을 0.5초로 설정.
  3. clearTimeout() 메서드를 사용해 0.5초가 지나기 전에 설정된 setTimeout()은 취소함.

## 3-1. UX
   - 키보드 방향키 조작만으로 추천 검색어 리스트 사이를 이동

```typescript
// src > components > SearchBar.tsx
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestList) {
      return
    }
    if (e.key === 'ArrowUp') {
      const arrowUpIndex = Math.max(selectedIdx - 1, -1)
      setSelectedIdx(arrowUpIndex)
    } else if (e.key === 'ArrowDown') {
      const arrowDownIndex = Math.min(selectedIdx + 1, suggestList.length - 1)
      setSelectedIdx(arrowDownIndex)
    }
  }
```
#### 'handleKeyDown()'
  1. suggestList가 없는 경우 바로 return 함으로써 추천 목록이 없을 때는 키 이벤트를 무시함.
  2. 위쪽 화살표 키가 눌린 경우, selectedIdx 값을 하나 감소시키되, 최소값은 -1로 설정함. setSelectedIdx 함수를 사용하여 선택된 인덱스를 업데이트.
  3. 아래쪽 화살표 키가 눌린 경우, selectedIdx 값을 하나 증가시키되, 최대값은 suggestList.length - 1(추천 검색어 리스트 하단부)로 설정함. setSelectedIdx 함수를 사용하여 선택된 인덱스를 업데이트합.

## 3-2. UX
  -  추천 검색어 리스트에서 선택된 항목이 목록 컨테이너의 경계를 벗어날 경우 스크롤 위치를 조절하여 선택된 항목이 항상 보이도록 함
  - 'useScrollToSelected()' 커스텀 훅 사용

```typescript
// src > hooks > useScrollToSelected.ts

import { useEffect, useRef } from 'react'

export const useScrollToSelected = (selectedIdx: number) => {
  const scrollListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (scrollListRef.current && selectedIdx !== -1) {
      const selectedEl = scrollListRef.current.children[
        selectedIdx
      ] as HTMLLIElement
      const listContainerRect = scrollListRef.current.getBoundingClientRect()
      const selectedItemRect = selectedEl.getBoundingClientRect()

      if (selectedItemRect.bottom > listContainerRect.bottom) {
        scrollListRef.current.scrollTop +=
          selectedItemRect.bottom - listContainerRect.bottom
      } else if (selectedItemRect.top < listContainerRect.top) {
        scrollListRef.current.scrollTop -=
          listContainerRect.top - selectedItemRect.top
      }
    } else if (scrollListRef.current) {
      scrollListRef.current.scrollTop = 0
    }
  }, [selectedIdx])
  return scrollListRef
}
```
#### 'useScrollToSelected()'
  1. scrollListRef라는 이름의 useRef hook을 사용하여 HTMLUListElement 타입의 참조를 생성.
  2. useEffect hook을 사용하여 선택된 인덱스(selectedIdx)가 변경될 때마다 스크롤 처리를 수행.
  3. useEffect 내부에서, scrollListRef.current가 존재하고 selectedIdx가 -1이 아닌 경우에만 스크롤 처리를 수행.
  4. getBoundingClientRect() 메서드를 사용해 선택된 항목(selectedEl)과 목록 컨테이너(scrollListRef.current)의 크기(위치) 정보를 가져옴.
  5. 선택된 항목이 목록 컨테이너의 아래쪽 경계를 벗어난 경우, 목록 컨테이너의 스크롤 위치를 아래로 이동시키고, 선택된 항목이 목록 컨테이너의 위쪽 경계를 벗어난 경우, 목록 컨테이너의 스크롤 위치를 위로 이동시킴.
  6. scrollListRef.current가 존재하지만 selectedIdx가 -1인 경우, 목록 컨테이너의 스크롤 위치를 맨 위로 이동시킵니다.