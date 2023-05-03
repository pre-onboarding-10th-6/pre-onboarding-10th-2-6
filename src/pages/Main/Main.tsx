import _ from 'lodash'
import React, { useState, useCallback } from 'react'

import { getSearchKeyword } from '../../api/api'
import KeywordList from '../../components/KeywordList'
import Searchbar from '../../components/Searchbar'
import { ResultItem } from '../../types/type'

function Main() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<ResultItem[]>([])

  const sendRequest = useCallback(
    _.debounce(async (req: any) => {
      console.log(`Sending request with query: ${req}`)
      const searchResultData = await getSearchKeyword(`${req}`)
      setSearchResults(searchResultData ?? [])
    }, 500),
    []
  )

  const handleSearchBarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
      sendRequest(e.target.value)
    },
    [sendRequest]
  )

  return (
    <main>
      <header>main header</header>
      <section>
        <Searchbar keyword={keyword} onChange={handleSearchBarChange} />
        <KeywordList results={searchResults} />
      </section>
      <footer>@휴먼이스케이프</footer>
    </main>
  )
}

export default Main
