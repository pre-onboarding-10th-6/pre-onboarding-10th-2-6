import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Input } from '../../components/Input'
import { useDebounce } from '../../hooks/useDebounce'
import useKeyHandler from '../../hooks/useKeyHandler'

interface SEARCH_ITEM {
  name: string
  id: number
}

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [result, setResult] = useState<SEARCH_ITEM[]>([])
  const [loading, setLoading] = useState(false)
  const { handleKeyUpDown, selectedIdx } = useKeyHandler(result)

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

  return (
    <main>
      <InputWrap>
        <Input
          id="searchInput"
          type="text"
          name="search"
          color="#333"
          placeholder=""
          value={searchKeyword}
          onChange={handleChange}
          onKeyDown={handleKeyUpDown}
        >
          {loading ? (
            <div>검색중...</div>
          ) : (
            Array.isArray(result) &&
            result.map((item: SEARCH_ITEM, idx) => (
              <Item key={item.id} tabIndex={0} isSelected={idx === selectedIdx}>
                {item.name}
              </Item>
            ))
          )}
        </Input>
      </InputWrap>
      <button>검색</button>
    </main>
  )
}

export default Search

const InputWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-right: 8px;
  background-color: #ffffff;
  font-weight: 400;
  font-size: 1rem;
  border: 2px solid;
  border-color: #ffffff;
  border-radius: 42px;
  line-height: 1.6;
  letter-spacing: -0.018em;
`

const Item = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? '#ddd' : '#fff')};
`
