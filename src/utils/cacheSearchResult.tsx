import axios from 'axios'

import { getSearchKeyword } from '../api/api'
import { CACHE_NAME, EXPIRE_TIME } from '../constants/constant'
const cacheName = CACHE_NAME
const cacheTtl = EXPIRE_TIME

export const searchWithCache = async function (keyword: string) {
  const cache = await caches.open(cacheName)

  const cachedResponse = await cache.match(keyword)
  if (cachedResponse) {
    console.log(`캐싱된 데이터가 있습니다: ${keyword}`)
    return cachedResponse.json()
  }

  console.log(`캐싱된 데이터가 없어서 API 호출: ${keyword}`)
  const response = await getSearchKeyword(`${keyword}`)
  if (response.status !== 200) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  // cache.put의 2번째 인자로 response타입이 들어가야한다고 함
  // 기존 response가 axiosReponse 타입이기 때문에 new Response를 이용해서 response 객체로 변경해줘야 정상작동
  const responseForCache = new Response(JSON.stringify(response.data))

  await cache.put(keyword, responseForCache)

  return response.data
}
