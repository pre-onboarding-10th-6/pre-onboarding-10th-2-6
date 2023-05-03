import axios, { AxiosResponse } from 'axios'

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
        const cachedData = await cachedResponse.clone().json() // 텍스트 데이터로 변환

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
