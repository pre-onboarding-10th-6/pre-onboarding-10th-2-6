import axios from 'axios'
import { useState } from 'react'

import { instance } from '../../api'
import { getSearchAPI } from '../../api/search'

const Search = () => {
  const [search, setSearch] = useState('')

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const URL = `http://localhost:3000/api/v1/search-conditions/?name=${search}`
    const cacheStorage = await caches.open('search')
    const existingCache = await cacheStorage.match(URL)

    if (existingCache) {
      console.log('cache exist')
      console.log(await existingCache.json()) // get data
    } else {
      console.log('cache does not exist')
      // const response = await fetch(URL)
      const res = await fetch(URL).then(response => {
        cacheStorage.put(URL, response)
        return response.json()
      })
      console.log(res) // get data
    }
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input value={search} onChange={onChangeHanlder}></input>
      <button>검색</button>
    </form>
  )
}

export default Search
