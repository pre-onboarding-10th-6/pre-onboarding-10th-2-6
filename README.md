<br />

# 1. 프로젝트

원티드 프론트엔드 인턴십 과제 <br>
목표: 검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현

배포링크:

## 팀원목록

## 팀원목록

- 팀장 : 이정진
- 팀원 : 곽현지, 김성주, 박재욱, 신종우, 양주영, 이원형, 정다솔, 정예지

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;팀6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;이정진&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;곽현지&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 김성주 | 박재욱 |
| :---: | :---: | :---: | :---: | :---: |
| 역할 | ![Leader](https://img.shields.io/badge/-%ED%8C%80%EC%9E%A5-blue) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) |
| Github | [wjdrk70](https://github.com/wjdrk70) | [hjKwak](https://github.com/KwakHyeonJi) | [dev-seongjoo](https://github.com/dev-seongjoo) | [LeChuckbb](https://github.com/LeChuckbb) | [jw3215](https://github.com/jw3215) 

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;신종우&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;양주영&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 이원형 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;정다솔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;정예지&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :---: | :---: | :---: | :---: | :---: |
| ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow) | ![팀원](https://img.shields.io/badge/-%ED%8C%80%EC%9B%90-yellow)
 | [jw3215](https://github.com/jw3215) | [yangddu](https://github.com/yangddu) | [WonhyeongLee](https://github.com/WonhyeongLee) | [ssori0421](https://github.com/ssori0421) | [sabit1997](https://github.com/sabit1997) |
<br />

<br />

# 2. 협업 방식

- 각자 기능 구현 후 코드 발표 진행
- 발표 후, 각자 코드 리뷰하며 코드 베이스 선정
- 선정된 코드 베이스에서 각 팀원의 좋은 코드를 취합해서 작성
- 비즈니스 로직 및 view 를 개선하여 PR 진행 후 merge

[git commit message 규칙 설정]

- 일관된 커밋 메시지의 형태로 가독성을 높이고, 팀원들의 작업 내역 및 변경사항 쉽게 파악 가능

<br />

# 3. 디렉토리 구조

```
📦
├─ src
│  ├─ api
│  ├─ components
│  ├─ constants
│  ├─ hooks
│  ├─ styles
│  ├─ types
└─ └─ utils
```

<br />

# 4. 코드 구조

## 검색어 추천 기능

검색어가 바뀔 때마다 `useDebounce` 훅을 사용하여 일정 시간(250ms) 동안 기다린 후 검색어를 업데이트하고, `useCache` 훅을 사용하여 검색 결과를 캐싱한다.

검색 결과가 캐시에 있는 경우 캐시된 데이터를 반환하고, 캐시에 없는 경우 `getDiseases` 함수를 호출하여 검색 결과를 가져온다.

검색어 추천 목록에서 아이템을 선택하면 `handleChangeKeyword` 함수가 호출되어 검색어 상태(keyword)가 업데이트된다.
검색어 추천 목록에서 선택된 아이템은 키보드로 이동할 수 있도록 `useKeyboardNavigation` 훅을 사용한다.

## 캐싱

Cache Storage를 선택한 이유

- 상대적으로 정적 상태로 유지된다.
- 물리적 구조이다.
- 네트워크 연결이 안되어도 사용할 수 있다.
- 속도가 빠르다.
- 저장 공간이 크다.

Cache Storage 활용법

```typescript
const cacheStorage = await caches.open(name)

await cacheStorage.put(
  key,
  new Response(JSON.stringify(newData), {
    headers: {
      Expires: getExpirationDate(duration)
    }
  })
)
```

## expire time

- cache headers 에 만료 일자를 설정한다.
- 캐시 만료 시, api 요청 후 캐시를 업데이트한다.
- 캐시 유효 시간은 CACHE_DURATION 상수값으로 관리한다.
- 캐시 만료 일자가 없으면 해당 캐시를 그냥 사용한다.
- 추천 검색어 API에서 제공되는 데이터는 시간이 지날수록 새로운 정보로 업데이트 되는 경우가 많아 최신 정보를 유지하기 위해 1시간으로 설정했다.

```typescript
await cacheStorage.put(
  key,
  new Response(JSON.stringify(newData), {
    headers: {
      Expires: getExpirationDate(duration)
    }
  })
)
```

## API 호출 횟수 제한 전략

`useDebounce` 훅은 검색어(keyword)를 입력받아 해당 검색어를 delay 시간동안 기다린 후, 그 검색어를 `debouncedKeyword`에 저장하여 반환한다.

이렇게 `debouncedKeyword`을 사용하면 사용자가 검색어를 계속해서 입력할 때마다 API 요청을 보내지 않고, 일정 시간 동안 검색어 입력이 멈춘 뒤에 API 요청을 보내게 된다. 이렇게 함으로써 API 호출 횟수를 제한할 수 있다.

`useDebounce` 훅은 `useState`와 `useEffect`를 사용하여, value와 delay가 바뀔 때마다 타이머를 초기화하고, delay 시간이 지난 후에 value를 `debouncedValue`에 저장하여 반환한다. 따라서 `debouncedKeyword`는 keyword의 마지막 값을 유지하며, delay 시간동안 keyword 값이 변경되지 않았다면 `debouncedKeyword` 값은 해당 검색어로 업데이트된다.

위와 같이 제한적으로 `debouncedKeyword`가 변경된 경우에만 `useCache` 훅에 변경된 상태가 반영되어 API 요청을 보내게 되므로, API 호출 횟수를 제한할 수 있다.

```typescript
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

```typescript
const debouncedKeyword = useDebounce<string>(keyword, 250)
const { cachedData: suggestions } = useCache<Disease[]>({
  initialData: [],
  name: CACHE_SUGGESTIONS,
  key: debouncedKeyword,
  duration: CACHE_DURATION,
  fetchData: getDiseases
})
```

## 키보드 조작

`useKeyboardNavigation` 커스텀 훅을 사용하여, 키보드 조작 시 검색어 추천 목록의 포커스 이동과 검색어 입력을 처리한다.

`handleMoveFocus` 함수는 `React.KeyboardEvent` 타입의 이벤트 객체를 받아와, 해당 이벤트가 일어난 input 요소에서의 keydown 이벤트에 대한 처리를 한다.

이 함수 내부에서는 ArrowDown, ArrowUp, Escape, Enter 키에 대한 처리를 한다.

- ArrowDown: 포커스 인덱스를 +1 하여 다음 아이템으로 포커스를 이동한다. 포커스 인덱스가 마지막 인덱스라면, 처음 아이템으로 이동한다.

- ArrowUp: 포커스 인덱스를 -1 하여 이전 아이템으로 포커스를 이동한다. 포커스 인덱스가 0이라면, 마지막 아이템으로 이동한다.

- Escape: 검색어 추천 목록에서 포커스를 해제한다.

- Enter: 포커스된 아이템이 있다면, 해당 아이템의 이름을 검색어로 설정한다.

이렇게 입력된 키 이벤트에 따라, 포커스 인덱스를 조작하여 검색어 추천 목록의 포커스를 이동시키고, 포커스가 설정된 아이템의 이름을 검색어로 설정한다.

```typescript
const useKeyboardNavigation = (
  suggestions: Disease[],
  setKeyword: React.Dispatch<React.SetStateAction<string>>
) => {
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  const handleMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) {
      return
    }

    const lastIndex = suggestions.length - 1

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
  }

  return { focusIndex, setFocusIndex, handleMoveFocus }
}
```

`useEffect`의 의존성 배열로 `debouncedkeyword` 을 줘서 검색어가 변경 될 때 포커스를 초기화 한다.

```typescript
useEffect(() => {
  setFocusIndex(-1)
}, [debouncedKeyword])
```

<br />

# 5. 설치 & 실행 방법

```
npm install
npm start
```

<br />

# 6. 기술 스택

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=black">
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=black">
<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=black">
<img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">
<img src="https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=black">
<img src="https://img.shields.io/badge/husky-E0E0E0?style=for-the-badge&logo=husky&logoColor=black">
