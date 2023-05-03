import _ from 'lodash'
import React, { useState, useCallback } from 'react'

import KeywordList from '../../components/KeywordList'
import Searchbar from '../../components/Searchbar'
import { DELAY_TIME } from '../../constants/constant'
import { ResultItem } from '../../types/type'
import { searchWithCache } from '../../utils/cacheSearchResult'

import { MainHeading, MainSection, MainWrapper } from './MainStyle'

function Main() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<ResultItem[]>([])
  const [isSearchbarFocused, setIsSearchbarFocused] = useState(false)

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
    <MainWrapper>
      <MainHeading>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </MainHeading>
      <MainSection onFocus={handleSearchbarFocus} onBlur={handleSearchbarBlur}>
        <Searchbar keyword={keyword} onChange={handleSearchBarChange} />
        {isSearchbarFocused && (
          <KeywordList
            results={searchResults}
            onClick={handleKeywordListClick}
          />
        )}
      </MainSection>
    </MainWrapper>
  )
}

export default Main
