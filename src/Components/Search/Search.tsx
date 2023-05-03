import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'

import SearchList from './SearchList'
import useSearch from './useSearch'

const Search = () => {
  const {
    onSubmitHandler,
    onChangeHanlder,
    setIsFocus,
    isFocus,
    searchResult,
    searchInput
  } = useSearch()

  return (
    <Form onSubmit={onSubmitHandler}>
      <SearchBox>
        <input
          type="search"
          value={searchInput}
          onChange={onChangeHanlder}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          // onKeyDown={() => console.log('onKeyDown')}
          placeholder="질환명을 입력해 주세요."
        />
        {/* <IconX /> */}
        <button>
          <IconSearch />
        </button>
      </SearchBox>

      {isFocus && (
        <SearchList searchResult={searchResult} searchInput={searchInput} />
      )}
    </Form>
  )
}

const Form = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgb(194, 200, 206);
  border-radius: 42px;
  padding: 12px 20px;
  gap: 8px;
  input {
    font-size: 16px;
    flex: 1 1 80%;
    outline: none;
    border: none;
    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      cursor: pointer;
    }
  }
`

export default Search
