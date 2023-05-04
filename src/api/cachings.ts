import { SearchData } from '../App'

interface saveCacheRequest {
  word: string
  data: SearchData[]
}
export const saveCache = async ({ word, data }: saveCacheRequest) => {
  try {
    const cache = await caches.open('my-cache')
    const response = new Response(JSON.stringify(data), {
      headers: { 'Cache-Control': 'max-age=30' }
    })
    await cache.put(word, response)
    if (!response.ok) {
      throw new Error(`Unexpected response status ${response.status}`)
    }
  } catch (error) {
    console.error('Error adding data to cache', error)
  }
}

export const findCache = async (word: string) => {
  try {
    const cache = await caches.open('my-cache')
    const response = await cache.match(word)

    if (response && response.status === 200) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

// FIX: 제대로 작동안함
export const deleteExpiredCaches = async () => {
  const cacheNames = await caches.keys()
  const result = []

  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)

      if (response) {
        const cacheHeaders = response.headers.get('cache-control')
        const maxAgeMatch = cacheHeaders && cacheHeaders.match(/max-age=(\d+)/)
        const maxAge = maxAgeMatch && parseInt(maxAgeMatch[1])

        if (maxAge) {
          const dateHeader = response.headers.get('date')

          const cacheTime = dateHeader ? new Date(dateHeader).getTime() : null

          if (cacheTime) {
            const expirationTime = cacheTime + maxAge * 1000
            const currentTime = Date.now()

            if (currentTime > expirationTime) {
              result.push(response)
              await cache.delete(request)
            }
          }
        }
      }
    }
  }
}
