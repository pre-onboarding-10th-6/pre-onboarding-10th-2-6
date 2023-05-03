import { SearchData } from '../types'

export const SEARCH_URL = `http://localhost:3000/api/v1/search-conditions/?name=`
export const SEARCH_STORAGE = 'search'

const isExpired = (response: Response) => {
  const cacheControl = response.headers.get('cache-control')
  const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 1
  const date = new Date(response.headers.get('date') as string).getTime()
  const expiration = date + maxAge * 1000
  const isExpired = Math.ceil(expiration - new Date().getTime())

  return isExpired < 0 ? true : false
}

const getNewResponse = (response: Response) => {
  const cacheControl = 'public, max-age=10'
  const headers = new Headers(response.headers)
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul'
  }
  headers.set('Cache-Control', cacheControl)
  headers.set('date', date.toLocaleString('en-US', options))
  return new Response(response.clone().body, {
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
          return null
        }
        return response
      })
    )
  }
}

export const fetchData = async (
  cache: Cache,
  URL: string,
  cnt: React.MutableRefObject<number>
) => {
  const existingCache = await cache.match(URL)

  let result: SearchData[]
  if (existingCache) {
    result = await existingCache.json() // get data
  } else {
    const response = await fetch(URL)
    const responseWithHeader = getNewResponse(response)
    await cache.put(URL, responseWithHeader)
    console.info(`Search API 호출 횟수 : ${(cnt.current += 1)}`)
    result = await response.json()
  }
  return result
}
