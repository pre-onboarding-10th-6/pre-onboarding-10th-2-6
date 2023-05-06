import { useEffect, useState } from 'react'
import styled from 'styled-components'

import SearchBar from '../../components/SearchBar'
import SearchContents from '../../components/SearchContents'
import { useDebounce } from '../../hooks/useDebounce'
import useInputs from '../../hooks/useInputs'
import useKeyHandler from '../../hooks/useKeyHandler'
import useSearchHandler from '../../hooks/useSearchHandler'

const Search = () => {
  const { values, handleChange } = useInputs('')
  const { result, loading, debouncedValue } = useSearchHandler(values)
  const { handleKeyUpDown, selectedIdx } = useKeyHandler(result, debouncedValue)
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <Main>
      <Head>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </Head>
      <SearchWrap>
        <SearchBar
          searchKeyword={values}
          isFocused={searchFocused}
          handleChange={handleChange}
          handleKeyUpDown={handleKeyUpDown}
          handleFocus={() => setSearchFocused(true)}
          handleBlur={() => setSearchFocused(false)}
        />
        {searchFocused && (
          <SearchContents
            result={result}
            loading={loading}
            selectedIdx={selectedIdx}
          />
        )}
      </SearchWrap>
    </Main>
  )
}

export default Search

const Main = styled.main`
  width: 100%;
  padding: 80px 0 160px;
  background-color: #cae9ff;
`

const Head = styled.h1`
  font-size: 2.125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 40px;
`

const SearchWrap = styled.div`
  width: 490px;
  margin: 0 auto;
  position: relative;
`
