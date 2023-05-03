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
  if (!timestampResponse) return true

  console.log(`------------만료기간 테스트-----------`)

  const timestampText = await timestampResponse.text()
  console.log(`timestampText: ${timestampText}`)

  const cachedTime = parseInt(timestampText)
  console.log(`cachedTime: ${cachedTime}`)

  const currentTime = Date.now()
  console.log(`currentTime: ${currentTime}`)
  console.log(currentTime - cachedTime > cacheTtl)
  console.log(`-------------------------------------`)
  return currentTime - cachedTime > cacheTtl
}

export const searchWithCache = async function (
  keyword: string
): Promise<ResultItem[]> {
  const cache = await caches.open(cacheName)

  if (!(await isCacheExpired(cache, keyword))) {
    const cachedResponse = await cache.match(keyword)
    if (cachedResponse) {
      console.log(`캐싱된 데이터가 있습니다: ${keyword}`)
      return cachedResponse.json()
    }
  }

  console.log(`캐싱된 데이터가 없어서 API 호출: ${keyword}`)

  const response = await getSearchKeyword(`${keyword}`)

  // cache.put의 2번째 인자로 response타입이 들어가야한다고 함
  // 기존 response가 axiosReponse 타입이기 때문에 new Response를 이용해서 response 객체로 변경해줘야 정상작동
  const responseForCache = new Response(JSON.stringify(response.data))
  await cache.put(keyword, responseForCache)

  // timestampResponse가 먼저 있는지 확인 후 저장
  const timestampResponse = await cache.match(`${keyword}_timestamp`)
  if (!timestampResponse) {
    const timestamp = new Response(Date.now().toString())
    await cache.put(`${keyword}_timestamp`, timestamp)
  }

  return response.data
}
