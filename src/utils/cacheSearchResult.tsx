import { getSearchKeyword } from '../api/api'
import { CACHE_NAME, EXPIRE_TIME } from '../constants/constant'
import { ResultItem } from '../types/type'
const cacheName = CACHE_NAME
const cacheTtl = EXPIRE_TIME

const isCacheExpired = async (
  cache: Cache,
  keyword: string
): Promise<boolean> => {
  const timestampResponse = await cache.match(`${keyword}_timestamp`)
  if (!timestampResponse) return false

  const timestampText = await timestampResponse.text()
  const cachedTime = parseInt(timestampText)
  const currentTime = Date.now()
  const isExpired = currentTime - cachedTime > cacheTtl

  return isExpired
}

const clearExpiredCache = async (cache: Cache): Promise<void> => {
  const keys = await cache.keys()

  const checkCaches = keys.map(async key => {
    const keyword = key.url

    const isExpired = await isCacheExpired(cache, keyword)
    return isExpired ? keyword : null
  })

  const expiredCaches = (await Promise.all(checkCaches)).filter(
    data => data !== null
  ) as string[]

  const deleteCaches = expiredCaches.map(async key => {
    await cache.delete(key)
    await cache.delete(`${key}_timestamp`)
  })

  await Promise.all(deleteCaches)
}

export const searchWithCache = async function (
  keyword: string
): Promise<ResultItem[]> {
  const cache = await caches.open(cacheName)

  // 만료된 cache 삭제
  await clearExpiredCache(cache)

  const cachedResponse = await cache.match(keyword)
  const timestampResponse = await cache.match(`${keyword}_timestamp`)

  if (cachedResponse && !(await isCacheExpired(cache, keyword))) {
    console.log('캐쉬데이터반환')
    return cachedResponse.json()
  }

  const response = await getSearchKeyword(`${keyword}`)
  const responseForCache = new Response(JSON.stringify(response.data))

  await cache.put(keyword, responseForCache)

  if (!timestampResponse || (await isCacheExpired(cache, keyword))) {
    const timestamp = new Response(Date.now().toString())
    await cache.put(`${keyword}_timestamp`, timestamp)
  }

  return response.data
}
