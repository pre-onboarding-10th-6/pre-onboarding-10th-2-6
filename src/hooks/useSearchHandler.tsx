import axios from 'axios'
import { useEffect, useState } from 'react'

import { SEARCH_ITEM } from '../types'

import { useDebounce } from './useDebounce'

const useSearchHandler = (searchKeyword: string) => {
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  const debouncedValue = useDebounce(searchKeyword)
  const BASE_URL = `/api/v1/search-conditions/?name=${debouncedValue}`
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function handleSearch() {
      setLoading(true)
      const cacheStorage = await caches.open('search')
      const cachedData = await cacheStorage.match(BASE_URL)
      try {
        if (cachedData) {
          const res = await cachedData.json()
          setResult(res)
        } else {
          const res = await axios.get(BASE_URL)
          console.info('calling api')
          cacheStorage.put(BASE_URL, new Response(JSON.stringify(res.data)))
          setResult(res.data)
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    handleSearch()
  }, [debouncedValue])

  return { result, loading }
}

export default useSearchHandler
