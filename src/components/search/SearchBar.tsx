import React, { FC } from 'react'

import SearchSuggestion from './SearchSuggestion'
import { Banner, Wrap } from './style'

const SearchBar: FC = () => {
  return (
    <Wrap>
      <Banner>
        <SearchSuggestion />
      </Banner>
    </Wrap>
  )
}

export default SearchBar
