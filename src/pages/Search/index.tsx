import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface SEARCH_ITEM {
  name: string
  id: number
}

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  //   const [loading, setLoading] = useState(true)
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const value = (e.target as HTMLInputElement).value
    setSearchKeyword(value)
  }

  const BASE_URL = `/api/v1/search-conditions/?name=${searchKeyword}`

  useEffect(() => {
    async function handleSearch() {
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
    }
    handleSearch()
  }, [searchKeyword])

  return (
    <main>
      <input value={searchKeyword} onChange={handleChange} />
      <button>검색</button>
      {Array.isArray(result) &&
        result.map((item: SEARCH_ITEM) => <div key={item.id}>{item.name}</div>)}
    </main>
  )
}

export default Search
