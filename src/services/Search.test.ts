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
