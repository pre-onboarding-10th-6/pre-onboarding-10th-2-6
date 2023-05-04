import React from 'react'
import styled from 'styled-components'

import { SearchData } from '../App'

const SearchResultWrapper = styled.ul`
  width: 100%;
  border-radius: 20px;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
  padding: 10px 0;
  background-color: #fff;
  margin-top: 10px;
  overflow: hidden;
`

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #b2b2b2;
  margin-left: 20px;
`

const SearchResultItem = styled.li`
  width: 100%;
  padding: 10px 20px;
  &:hover {
    background-color: #f8f9fa;
  }
`

const EmptySearchMessage = styled.span`
  font-size: 1.6rem;
  font-weight: 500;
  color: gray;
  margin-left: 20px;
`

interface SearchResultProps {
  results: SearchData[]
}

const SearchResult = ({ results }: SearchResultProps) => {
  return (
    <SearchResultWrapper>
      <Title>추천 검색어</Title>
      {results && results.length > 0 ? (
        results.map(result => (
          <SearchResultItem key={result.id}>{result.name}</SearchResultItem>
        ))
      ) : (
        <EmptySearchMessage>검색어 없음</EmptySearchMessage>
      )}
    </SearchResultWrapper>
  )
}

export default SearchResult
