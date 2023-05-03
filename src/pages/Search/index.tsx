import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { useDebounce } from '../../hooks/useDebounce'

interface SEARCH_ITEM {
  name: string
  id: number
}

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedValue = useDebounce(searchKeyword)
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const value = (e.target as HTMLInputElement).value
    setSearchKeyword(value)
  }

  const BASE_URL = `/api/v1/search-conditions/?name=${debouncedValue}`

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

  return (
    <main>
      <input value={searchKeyword} onChange={handleChange} />
      <button>검색</button>
      {loading ? (
        <div>검색중...</div>
      ) : (
        Array.isArray(result) &&
        result.map((item: SEARCH_ITEM) => <div key={item.id}>{item.name}</div>)
      )}
      <div>current value: {debouncedValue}</div>
    </main>
  )
}

export default Search
