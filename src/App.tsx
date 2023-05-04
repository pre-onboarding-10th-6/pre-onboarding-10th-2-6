import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { findCache, saveCache } from './api/cachings'
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
export interface SearchData {
  name: string
  id: number
}

function App() {
  const [keyword, setKeyword] = useState<string>('')
  const [results, setResults] = useState<SearchData[]>([])

  const search = async (word: string) => {
    if (keyword !== '') {
      const findResult = await findCache(word)
      if (findResult) {
        setResults(findResult)
      } else {
        try {
          const response = await searchAPI(word)
          const data = response.data
          if (response && response.status === 200) {
            setResults(data)
            await saveCache({ word, data })
            console.info('calling api')
          } else {
            throw new Error(`Unexpected response status ${response?.status}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  // useEffect(() => {
  //   const InterValId = setInterval(deleteExpiredCaches, 60 * 60 * 1000)

  //   return () => {
  //     clearInterval(InterValId)
  //   }

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const debounceSearch = debounce(() => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        search(keyword)
      }, 1000)
    }, 500)

    debounceSearch()

    return () => {
      clearTimeout(timeoutId)
      debounceSearch.cancel()
    }
  }, [keyword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value
    setKeyword(keyword)
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
