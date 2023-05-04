import { useState, useEffect } from 'react'

import { getExpirationDate } from '../utils/cache'

interface UseCacheProps<T> {
  initialData: T
  name: string
  key: string
  duration: number
  fetchData: (name: string) => Promise<T>
}

const useCache = <T>({
  initialData,
  name,
  key,
  duration,
  fetchData
}: UseCacheProps<T>) => {
  const [cachedData, setCachedData] = useState(initialData)

  useEffect(() => {
    const fetch = async () => {
      const cacheStorage = await caches.open(name)
      const newData = await fetchData(key)

      await cacheStorage.put(
        key,
        new Response(JSON.stringify(newData), {
          headers: {
            Expires: getExpirationDate(duration)
          }
        })
      )

      setCachedData(newData)
    }

    const checkCache = async () => {
      try {
        const cacheStorage = await caches.open(name)
        const cache = await cacheStorage.match(key)

        if (cache?.status === 200) {
          console.info('returning cached result for', name)
          try {
            await fetch()
            return
          } catch (error) {
            console.log('Failed to parse cached data as JSON:', error)
            await cacheStorage.delete(key)
          }
        }

        const expires = cache?.headers.get('Expires')

        if (!expires) {
          setCachedData(await cache?.json())
          return
        }

        const expiresDate = new Date(expires)
        const currentDate = new Date()
        expiresDate <= currentDate
          ? fetch()
          : setCachedData(await cache?.json())
      } catch (error) {
        console.error(error)
      }
    }

    key ? checkCache() : setCachedData(initialData)
  }, [key])

  return { cachedData }
}

export default useCache
