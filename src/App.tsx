import React, { useCallback, useEffect, useRef, useState } from 'react'

import { getSearchConditions } from './api'
import './App.css'
import { SearchInputBox } from './components/SearchInputBox'
import SearchResultList from './components/SearchResultList'
import Styled from './components/style'
import useIterator from './hooks/useIterator'
import { debounce } from './utils'
import { CacheStore } from './utils/cacheStore'

const conditionSearchCache = new CacheStore({
  hours: 0,
  minutes: 15,
  seconds: 0,
})

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState<Condition[]>([])
  const [focusedItem, prevItem, nextItem, resetIter] = useIterator(searchResult)

  const fetchAllowed = useRef(true)

  const searchOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchInput(e.target.value), [])

  const fetchData = useCallback(debounce(
    (name: string) => {
      const cache = conditionSearchCache.get(name)
      if (cache) {
        setSearchResult(cache)
        resetIter()
      }
      else
        getSearchConditions(name)
          .then(res => res.data)
          .then(data => {
            setSearchResult(data)
            resetIter()
            conditionSearchCache.set(name, data)
          })
    }, 200
  ), [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    fetchAllowed.current = false
    if (e.key === 'ArrowDown')
      nextItem()
    else if (e.key === 'ArrowUp')
      prevItem()
    else
      fetchAllowed.current = true
  }, [prevItem, nextItem])

  useEffect(() => {
    if (!fetchAllowed.current)
      setSearchInput(focusedItem.name)
  }, [focusedItem])

  useEffect(() => {
    if (fetchAllowed.current && searchInput)
      fetchData(searchInput)
  }, [searchInput, fetchData])

  return (

    <Styled.Main>
      <Styled.Container>
        <SearchInputBox searchInput={searchInput} searchOnChange={searchOnChange} handleKeyDown={handleKeyDown} />
        {
          (searchInput && searchResult.length > 0) &&
          <SearchResultList searchResult={searchResult} focusedItem={focusedItem} />
        }
        {
          (searchInput && searchResult.length === 0) &&
          <div>검색 결과가 없습니다.</div>
        }
      </Styled.Container>
    </Styled.Main>
  )
}

export default App
