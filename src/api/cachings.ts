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
