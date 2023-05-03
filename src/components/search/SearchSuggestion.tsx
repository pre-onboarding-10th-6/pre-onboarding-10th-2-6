import React, { FC, useState, useEffect, useRef, useCallback } from 'react'

import SearchService, { SearchResult } from '../../services/SearchService'

import { Button, Input, InputWrap, Item, SearchBox, Title } from './style'

const DEBOUNCE_DELAY_MS = 1000

const SearchSuggestion: FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  useEffect(() => {
    if (!searchInput) {
      setSearchResults([])
      return
    }

    const searchService = new SearchService(60 * 1000) // 1분으로 expire time 설정

    const timeout = setTimeout(() => {
      searchService.search(searchInput).then((data: SearchResult[]) => {
        setSearchResults(data)
      })
    }, DEBOUNCE_DELAY_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [searchInput])

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchInput(result.name)
    setSearchResults([])
    inputRef.current?.focus()
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusIndex > 0) {
        setFocusIndex(prevFocus => prevFocus - 1)
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (focusIndex < searchResults.length - 1) {
        setFocusIndex(focusIndex + 1)
      }
    }
    if (e.key === 'Enter') {
      const selectedResult = searchResults[focusIndex].name

      setSearchInput(selectedResult)
    }
  }

  console.log('ff', focusIndex)
  return (
    <>
      <Title>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </Title>
      <div style={{ display: 'flex', maxWidth: '490px' }}>
        <InputWrap>
          <Input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={e => {
              setSearchInput(e.target.value)
              setFocusIndex(-1)
            }}
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
          <Button>
            <div style={{ width: '21px', height: '21px' }}>
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.56 0a6.56 6.56 0 015.255 10.49L16 14.674 14.675 16l-4.186-4.184A6.56 6.56 0 116.561 0zm0 1.875a4.686 4.686 0 100 9.372 4.686 4.686 0 000-9.372z"></path>
              </svg>
            </div>
          </Button>
          {searchResults.length > 0 && (
            <SearchBox>
              {searchResults.map((result, idx) => (
                <Item
                  key={result.id}
                  style={
                    focusIndex === idx ? { backgroundColor: '#f3f4f6' } : {}
                  }
                  onClick={() => handleSearchResultClick(result)}
                >
                  {result.name}
                </Item>
              ))}
            </SearchBox>
          )}
        </InputWrap>
      </div>
    </>
  )
}

export default SearchSuggestion
