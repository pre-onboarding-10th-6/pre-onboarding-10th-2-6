import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getDiseases } from '../api/search'
import { CACHE_SUGGESTIONS, CACHE_DURATION } from '../constants/cache'
import useCache from '../hooks/useCache'
import useDebounce from '../hooks/useDebounce'
import useInput from '../hooks/useInput'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import { Disease } from '../types/disease'

import SearchBar from './SearchBar'
import SearchSuggestions from './SearchSuggestions'

const SearchLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 80px 0 160px 0;
  width: 100%;
  background: #cae9ff;

  h1 {
    margin: 0 0 40px 0;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
  }

  .search-section {
    position: relative;
    width: 490px;
  }
`

const Search = () => {
  const { value: keyword, setValue: setKeyword, handleChange } = useInput('')
  const debouncedKeyword = useDebounce<string>(keyword, 250)

  const { cachedData: suggestions } = useCache<Disease[]>({
    initialData: [],
    name: CACHE_SUGGESTIONS,
    key: debouncedKeyword,
    duration: CACHE_DURATION,
    fetchData: getDiseases
  })

  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const handleChangeKeyword = (
    e: React.MouseEvent<HTMLLIElement>,
    newKeyword: string
  ) => {
    e.preventDefault()
    setKeyword(newKeyword)
  }

  const { focusIndex, setFocusIndex, handleMoveFocus } = useKeyboardNavigation(
    suggestions,
    setKeyword
  )

  useEffect(() => {
    setFocusIndex(-1)
  }, [debouncedKeyword])

  return (
    <SearchLayout>
      <h1>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h1>
      <section className="search-section">
        <SearchBar
          keyword={keyword}
          focused={searchBarFocused}
          handleChange={handleChange}
          handleMoveFocus={handleMoveFocus}
          handleFocus={() => setSearchBarFocused(true)}
          handleBlur={() => setSearchBarFocused(false)}
        />
        {searchBarFocused && (
          <SearchSuggestions
            suggestions={suggestions}
            focusIndex={focusIndex}
            handleChangeKeyword={handleChangeKeyword}
          />
        )}
      </section>
    </SearchLayout>
  )
}

export default Search
