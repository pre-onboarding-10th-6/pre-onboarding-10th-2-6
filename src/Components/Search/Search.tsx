import { useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'

import SearchList from './SearchList'
import useSearch from './useSearch'

const Search = () => {
  const {
    onSubmitHandler,
    onChangeHanlder,
    onKeyDownHandler,
    searchState,
    focusedItem,
    searchItemCnt,
    onMouseDownHandler
  } = useSearch()

  console.log(searchState)

  const [isFocus, setIsFocus] = useState(false)

  return (
    <Form
      onSubmit={onSubmitHandler}
      onBlur={() => setIsFocus(false)}
      onFocus={() => setIsFocus(true)}
    >
      <SearchBox>
        <input
          type="search"
          value={searchState.input}
          onChange={onChangeHanlder}
          onKeyDown={onKeyDownHandler}
          placeholder="질환명을 입력해 주세요."
        />
        <button>
          <IconSearch />
        </button>
      </SearchBox>

      {isFocus && (
        <SearchList
          searchState={searchState}
          focusedItem={focusedItem}
          searchItemCnt={searchItemCnt}
          onMouseDownHandler={onMouseDownHandler}
        />
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
  button {
    display: contents;
  }
`

export default Search
