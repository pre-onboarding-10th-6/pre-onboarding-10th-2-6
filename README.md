# week 2 assignment

## 로컬 캐시 구현

- JS의 built-in 자료구조인 `Map` 사용 (key - value 해시테이블)
- in-memory caching
- 새로고침하거나, 탭을 닫았다가 다시 열면 cache 증발 (JS 런타임이 바뀌기 때문)
- `Map`을 래핑하는 클래스를 별도로 정의함(`CacheStore`)
- 생성자 함수의 인자는 `duration`(만료기한)을 받음
- 만료기한이 지난 value를 조회하는 경우 null 반환

```typescript
// src/utils/cacheStore.ts
type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
}

class CacheStore {
  private cache: Map<string, { expiration: number; conditions: Condition[] }>;
  private duration: Duration;

  constructor(duration: Duration) {
    this.cache = new Map();
    this.duration = duration;
  }

  get(key: string) {
    const data = this.cache.get(key)
    if (!data) return null
    if (data.expiration < Date.now()) return null
    return data.conditions
  }

  .
  .
  .

}

// src/App.tsx

const conditionSearchCache = new CacheStore({
  hours: 0,
  minutes: 15,
  seconds: 0,
})

```

## Event 최적화

- 키보드 입력마다 API를 호출하는 것을 막기 위해 debouncing 적용
  - debounce: 미리 지정한 시간간격(interval)사이에 입력이 끊이지 않고 계속해서 들어오는 경우 하나의 입력으로 처리
  - 200ms 간격으로 지정

```typescript
// src/utils/index.ts

export function debounce<Params extends unknown[]>(
func: (...args: Params) => unknown,
timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
```

## UX

- 키보드만으로 추천 검색어들 사이에 이동 가능
- `useIterator()` 커스텀 훅을 정의하여, 추천 검색어들 사이를 순회

```typescript
// src/hooks/useIterator.ts

import { useState } from "react";

const useIterator = <T>(items: T[]) => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    let prevIndex
    if (index === 0)
      prevIndex = items.length - 1
    else
      prevIndex = index - 1

    setIndex(prevIndex)
  };

  const next = () => {
    let nextIndex
    if (index === items.length - 1)
      nextIndex = 0
    else
      nextIndex = index + 1

    setIndex(nextIndex)
  };

  const item = items[index];

  const reset = () => {
    setIndex(0);
  };

  return [item, prev, next, reset] as const;
}

export default useIterator;

```

