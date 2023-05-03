import { SearchData } from '../types'

export const SEARCH_URL = `http://localhost:3000/api/v1/search-conditions/?name=`
export const SEARCH_STORAGE = 'search'

const isExpired = (response: Response) => {
  const cacheControl = response.headers.get('cache-control')
  const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 0
  const date = Date.parse(response.headers.get('date') as string)
  const expiration = date + maxAge * 1000
  const currentTime = Date.now()

  return expiration <= currentTime
}

const getNewResponse = (response: Response) => {
  const cacheControl = 'public, max-age=10'
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', cacheControl)
  headers.set('Date', new Date().toUTCString())

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

// Cache Storage 내 유효기간이 만료된 캐시 삭제
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
