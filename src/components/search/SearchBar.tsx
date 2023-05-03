import React, { FC } from 'react'

import SearchSuggestion from './SearchSuggestion'
import { Banner, Wrap } from './style'

type SearchBarProps = {
  onSearch: (query: string) => void
}

const SearchBar: FC<SearchBarProps> = () => {
  return (
    <Wrap>
      <Banner>
        <SearchSuggestion />
      </Banner>
    </Wrap>
  )
}

export default SearchBar
