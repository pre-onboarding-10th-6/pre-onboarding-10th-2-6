## 캐싱구현

- cache storage 에 저장
- 처음 '암' 검색시는 api data 반환 두번째 검색시는 cache storage 에
  있는 cache key 가 매치되면 status 200 으로 구분하여
  cachedResponse 를 clone 후 json 으로 반환
- `const cacheResponse = new Response(JSON.stringify(responseData), {
  headers: cacheHeaders
})` 이렇게 stringfy 하지 않으면 [object,object],[object,object]
  형태로 반환되기에 미리 반환해줘야함
- expiretime 은 1분으로 지정하엿음 `cacheHeaders.set('cache-control', `max-age=${this.cacheExpireTime}`)` 에 헤더에 max 값 지정

```typescript
export type SearchResult = {
  id: number
  name: string
}

class SearchService {
  private cacheExpireTime: number

  constructor(cacheExpireTime: number) {
    this.cacheExpireTime = cacheExpireTime
  }

  public async search(name: string): Promise<any> {
    const cacheStorage = await caches.open('search')
    const cacheKey = `api/v1/search-conditions/?name=${encodeURIComponent(
      name
    )}`

    const cachedResponse = await cacheStorage.match(cacheKey)
    console.log('match', cachedResponse)
    if (cachedResponse?.status === 200) {
      console.info('returning cached result for', name)
      try {
        const cachedData = await cachedResponse.clone().json()

        console.log('cached data', cachedData)
        return cachedData
      } catch (error) {
        console.log('Failed to parse cached data as JSON:', error)
        await cacheStorage.delete(cacheKey)
      }
    }

    console.info('calling api', name)
    const response: AxiosResponse = await axios.get(cacheKey)

    const responseData = response.data
    const cacheHeaders = new Headers(Object.entries(response.headers))
    // Set max-age to cacheExpireTime
    cacheHeaders.set('cache-control', `max-age=${this.cacheExpireTime}`)
    const cacheResponse = new Response(JSON.stringify(responseData), {
      headers: cacheHeaders
    })

    await cacheStorage.put(cacheKey, cacheResponse)

    console.info('responseData', responseData)

    return responseData
  }
}

export default SearchService
```

## 호출횟수

- input event 가 발생시 디바운싱 1초로 두어 여러번 호출안되게 방지

## 키보드 이동

- focusIndex init 값을 -1 을 주어 handleKeyPress key 값에
  따라 조건값 설정 searchResult 의 length 값에 따라 focusIndex 변경
- enter 시 serachResult index 의 name 값을 찾아 저장

```typescript
const handleSearchResultClick = (result: SearchResult) => {
  setSearchInput(result.name)
  setSearchResults([])
  inputRef.current?.focus()
}
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (focusIndex > 0) {
      setFocusIndex(prevFocus => prevFocus - 1)
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (focusIndex < searchResults.length - 1) {
      setFocusIndex(focusIndex + 1)
    }
  }
  if (e.key === 'Enter') {
    const selectedResult = searchResults[focusIndex].name

    setSearchInput(selectedResult)
  }
}
```

## test 코드

- 현재 test code 를 작성했지만 tsconfig 문제인지
  `/Users/LJJ/Documents/week2/node_modules/axios/index.js:1
  ({"Object.<anonymous>":function(module,exports,require,**dirname,**filename,jest){import axios from './lib/axios.js';
  ^^^^^^

  SyntaxError: Cannot use import statement outside a module

  > 1 | import axios from 'axios'

      | ^

  2 |
  3 | import SearchService from './SearchService'
  4 |

  at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1728:14)
  at Object.<anonymous> (src/services/Search.test.ts:1:1)`
  es module 을 인식못함
  해결방안 찾는중

  - test case 는 '암' 을 1번째 입력시는 api 에서 받아오고 2번째 입력시 cache storage 에 받아오는 확인 하는 방안으로 작성

```typescript
import axios from 'axios'

import SearchService from './SearchService'

describe('SearchService', () => {
  const mockCacheStorage = {
    cache: new Map(),
    async match(key: string) {
      const cachedResponse = this.cache.get(key)
      if (cachedResponse) {
        return cachedResponse
      }
    },
    async put(key: string, response: Response) {
      this.cache.set(key, response)
    },
    async delete(key: string) {
      this.cache.delete(key)
    }
  }

  const mockAxiosResponse = {
    data: [
      { id: 7717, name: '암내' },
      { id: 7436, name: '암 전이' }
    ],
    headers: {},
    config: {},
    status: 200,
    statusText: 'OK'
  }

  const mockAxios = {
    async get(url: string) {
      return mockAxiosResponse
    }
  }

  beforeEach(() => {
    jest
      .spyOn(global, 'caches', 'get')
      .mockResolvedValue(mockCacheStorage as never)
    jest.spyOn(axios, 'get').mockImplementation(mockAxios.get)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    mockCacheStorage.cache.clear()
  })

  it('should return cached result when available', async () => {
    const searchService = new SearchService(60)

    const cacheKey = 'api/v1/search-conditions/?name=%EC%95%94'
    const responseData = [
      { id: 7717, name: '암내' },
      { id: 7436, name: '암 전이' }
    ]

    const cacheHeaders = new Headers({
      'cache-control': `max-age=${60}`
    })
    const cacheResponse = new Response(JSON.stringify(responseData), {
      headers: cacheHeaders,
      status: 200
    })
    mockCacheStorage.cache.set(cacheKey, cacheResponse)

    const result = await searchService.search('암')

    expect(result).toEqual(responseData)
  })

  it('should call api when cache is not available', async () => {
    const searchService = new SearchService(60)

    const responseData = [
      { id: 7717, name: '암내' },
      { id: 7436, name: '암 전이' }
    ]
    mockAxiosResponse.data = responseData

    const result = await searchService.search('암')

    expect(result).toEqual(responseData)

    const cacheKey = 'api/v1/search-conditions/?name=%EC%95%94'
    const cachedResponse = mockCacheStorage.cache.get(cacheKey)

    expect(cachedResponse).toBeDefined()
    if (cachedResponse) {
      const cachedData = await cachedResponse.clone().json()
      expect(cachedData).toEqual(responseData)
      const cacheControlHeader = cachedResponse.headers.get('cache-control')
      expect(cacheControlHeader).toEqual(`max-age=${60}`)
    }
  })
})
```
