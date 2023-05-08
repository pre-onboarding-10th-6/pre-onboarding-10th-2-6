import { useEffect, useState } from 'react'

import { searchAPI } from '../api'
import { SEARCH_ITEM } from '../types'
import { getExpirationDate } from '../utils/cache'

import { useDebounce } from './useDebounce'

const useSearchHandler = (searchKeyword: string) => {
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  const debouncedValue = useDebounce<string>(searchKeyword, 300)
  const BASE_URL = `/?name=${debouncedValue}`
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function handleSearch() {
      const cacheStorage = await caches.open('search')
      const res = await searchAPI(debouncedValue)
      console.info('calling api')
      const duration = 60 * 60 * 1000
      await cacheStorage.put(
        BASE_URL,
        new Response(JSON.stringify(res.data), {
          headers: {
            Expires: getExpirationDate(duration)
          }
        })
      )
      setResult(res.data)
    }

    const checkCache = async () => {
      const cacheStorage = await caches.open('search')
      const cachedData = await cacheStorage.match(BASE_URL)

      try {
        if (cachedData?.status !== 200) {
          handleSearch()
          return
        }

        const expires = cachedData?.headers.get('Expires')

        if (!expires) {
          setResult(await cachedData.clone().json())
          return
        }

        const expiresDate = new Date(expires)
        const currentDate = new Date()
        expiresDate <= currentDate
          ? handleSearch()
          : setResult(await cachedData.clone().json())
      } catch (err) {
        console.error(err)
        await cacheStorage.delete(debouncedValue)
      }
    }
    debouncedValue ? checkCache() : setResult([])
  }, [debouncedValue])

  return { result, loading, debouncedValue }
}

export default useSearchHandler
