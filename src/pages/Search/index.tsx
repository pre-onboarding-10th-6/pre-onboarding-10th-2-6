import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface SEARCH_ITEM {
  name: string
  id: number
}

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [result, setResult] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const value = (e.target as HTMLInputElement).value
    setSearchKeyword(value)
  }

  const BASE_URL = `/api/v1/search-conditions/?name=${searchKeyword}`
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(BASE_URL)
        console.log(res.data)
        setResult(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [searchKeyword])

  return (
    <main>
      <input value={searchKeyword} onChange={handleChange} />
      <button />
      {result.map((item: SEARCH_ITEM) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </main>
  )
}

export default Search
