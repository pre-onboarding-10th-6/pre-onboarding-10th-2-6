import _ from 'lodash'
import React, { useState, useCallback } from 'react'

import KeywordList from '../../components/KeywordList'
import SearchBar from '../../components/SearchBar'
import { DELAY_TIME } from '../../constants/constant'
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation'
import { ResultItem } from '../../types/type'
import { searchWithCache } from '../../utils/cacheSearchResult'

import {
  SearchMainHeading,
  SearchMainSection,
  SearchMainWrapper
} from './SearchStyle'

function Search() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<ResultItem[]>([])
  const [isSearchbarFocused, setIsSearchbarFocused] = useState(false)

  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(
    searchResults.length,
    index => {
      const selectedKeyword = searchResults[index]?.name || ''
      setIsSearchbarFocused(false)
      setKeyword(selectedKeyword)
    }
  )

  const sendRequest = useCallback(
    _.debounce(async (req: string) => {
      if (req.trim() !== '') {
        console.log(`Sending request with query: ${req}`)
        const searchResultData = await searchWithCache(req)
        setSearchResults(searchResultData)
      } else {
        setSearchResults([])
      }
    }, DELAY_TIME),
    []
  )

  const handleSearchBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value
    setKeyword(prevKeyword => {
      if (prevKeyword !== newKeyword) {
        sendRequest(newKeyword)
      }
      return newKeyword
    })
  }

  const handleSearchbarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length > 0 && !isSearchbarFocused) {
      e.preventDefault()
      handleKeyDown(e as unknown as React.KeyboardEvent<HTMLUListElement>)
    }
  }

  const handleSearchbarFocus = () => {
    setIsSearchbarFocused(true)
  }

  const handleSearchbarBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // 현재 target이 자식요소인지 확인
    if (!e.currentTarget?.contains(e.relatedTarget as Node)) {
      setIsSearchbarFocused(false)
    }
  }

  const handleKeywordListClick = (selectedKeyword: string) => {
    setKeyword(selectedKeyword)
    setIsSearchbarFocused(false)
    sendRequest(selectedKeyword)
  }

  return (
    <SearchMainWrapper>
      <SearchMainHeading>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </SearchMainHeading>
      <SearchMainSection
        onFocus={handleSearchbarFocus}
        onBlur={handleSearchbarBlur}
      >
        <SearchBar
          keyword={keyword}
          onChange={handleSearchBarChange}
          onKeyDown={handleSearchbarKeyDown}
        />
        {isSearchbarFocused && (
          <KeywordList
            results={searchResults}
            onClick={handleKeywordListClick}
            onKeyDown={handleKeyDown}
            selectedIndex={selectedIndex}
          />
        )}
      </SearchMainSection>
    </SearchMainWrapper>
  )
}

export default Search
