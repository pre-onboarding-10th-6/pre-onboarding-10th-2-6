import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getSuggestions } from '../api/search'
import { CACHE_SUGGESTIONS, CACHE_DURATION } from '../constants/cache'
import useCache from '../hooks/useCache'
import useDebounce from '../hooks/useDebounce'
import useInput from '../hooks/useInput'
import { Suggestion } from '../types/search'

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

  const { cachedData: suggestions } = useCache<Suggestion[]>({
    initialData: [],
    name: CACHE_SUGGESTIONS,
    key: debouncedKeyword,
    duration: CACHE_DURATION,
    fetchData: getSuggestions
  })

  const [searchBarFocused, setSearchBarFocused] = useState(false)
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  const handleChangeKeyword = (
    e: React.MouseEvent<HTMLLIElement>,
    newKeyword: string
  ) => {
    e.preventDefault()
    setKeyword(newKeyword)
  }

  const handleMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) {
      return
    }

    const lastIndex = suggestions.length - 1

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex < lastIndex ? prevIndex + 1 : 0))
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setFocusIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : lastIndex))
        break
      }
      case 'Escape': {
        setFocusIndex(-1)
        break
      }
      case 'Enter': {
        focusIndex > -1 && setKeyword(suggestions[focusIndex].name)
        break
      }
      default: {
        break
      }
    }
  }

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
