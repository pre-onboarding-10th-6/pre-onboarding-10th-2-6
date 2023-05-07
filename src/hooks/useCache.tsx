import { useRef, useState } from 'react'

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

const useCache = (cacheStorageName: string) => {
  const apiCallCnt = useRef(0)
  const [cachedData, setCachedData] = useState<SearchData[]>([])

  const removeExpiredCache = async (cacheName: string) => {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()

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

  const fetchData = async (cacheName: string, searchInput: string) => {
    const cache = await caches.open(cacheName)
    const existingCache = await cache.match(searchInput)
    if (existingCache) {
      return existingCache.json()
    }
    const response = await fetch(`${SEARCH_URL}${searchInput}`)
    const responseWithHeader = getNewResponse(response.clone())
    await cache.put(searchInput, responseWithHeader)

    console.info(`Search API 호출 횟수 : ${(apiCallCnt.current += 1)}`)
    return await response.json()
  }

  const fetchCached = async (debouncedInput: string) => {
    if (debouncedInput === '') return
    await removeExpiredCache(cacheStorageName)
    const result = await fetchData(cacheStorageName, debouncedInput)
    setCachedData(result)
  }

  return { cachedData, fetchCached }
}

export default useCache
