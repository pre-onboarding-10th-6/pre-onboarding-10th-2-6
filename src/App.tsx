import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import searchAPI from './api/searchAPI'
import SearchInput from './components/SearchInput'
import SearchResult from './components/SearchResult'
import GlobalStyle from './styles/GlobalStyle'
import { backgroundBlue } from './styles/mixins'

const PageWrapper = styled.div`
  ${backgroundBlue}
  width: 100%;
  height: 100vh;
`

const SearchSectionWrapper = styled.div`
  width: 480px;
  margin: 0 auto;
  padding-top: 100px;
`
export interface Data {
  name: string
  id: number
}

function App() {
  const [keyword, setKeyword] = useState<string>('')
  const [results, setResults] = useState<Data[]>([])

  const search = async (word: string) => {
    try {
      const response = await searchAPI(word)
      const data = await response.data
      setResults(data)
    } catch (e) {
      console.log(e)
    }
  }

  const debouncedSearch = debounce(search, 200)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value
    setKeyword(keyword)
    debouncedSearch(keyword)
  }

  return (
    <PageWrapper>
      <GlobalStyle />
      <SearchSectionWrapper>
        <SearchInput value={keyword} onChange={handleInputChange} />
        {keyword === '' ? null : <SearchResult results={results} />}
      </SearchSectionWrapper>
    </PageWrapper>
  )
}

export default App
