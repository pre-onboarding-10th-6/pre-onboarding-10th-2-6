import { useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'
import { RECENT_KEYWORDS } from '../../types'

import useSearch from './useSearch'

const Search = () => {
  const {
    onSubmitHandler,
    onChangeHanlder,
    onKeyDownHandler,
    searchResult,
    searchInput,
    focusedItem,
    searchItemCnt,
    onMouseDownHandler
  } = useSearch()

  const [isFocus, setIsFocus] = useState(false)
  const recentKeywords = JSON.parse(
    sessionStorage.getItem(RECENT_KEYWORDS) as string
  )

  const RecentKeyword = () => {
    return (
      <>
        <p>최근 검색어</p>
        {recentKeywords.map((keyword: string, idx: number) => (
          <Item
            key={idx}
            className={focusedItem === idx ? 'focused' : ''}
            onMouseDown={onMouseDownHandler}
          >
            <IconSearch />
            {keyword}
          </Item>
        ))}
      </>
    )
  }

  const SearchResult = () => {
    return searchResult.length === 0 ? (
      <p>검색 결과가 없습니다.</p>
    ) : (
      <>
        <Item
          className={focusedItem === 0 ? 'focused' : ''}
          onMouseDown={onMouseDownHandler}
        >
          <IconSearch />
          {searchInput}
        </Item>
        <p>추천 검색어</p>
        {searchResult.slice(0, 7).map((arr, idx: number) => (
          <Item
            key={arr.id}
            className={focusedItem === idx + 1 ? 'focused' : ''}
            onMouseDown={onMouseDownHandler}
          >
            <IconSearch />
            {arr.name}
          </Item>
        ))}
      </>
    )
  }

  return (
    <Form
      onSubmit={onSubmitHandler}
      onBlur={() => setIsFocus(false)}
      onFocus={() => setIsFocus(true)}
    >
      <SearchBox>
        <input
          type="search"
          value={searchInput}
          onChange={onChangeHanlder}
          onKeyDown={onKeyDownHandler}
          placeholder="질환명을 입력해 주세요."
        />
        <button>
          <IconSearch />
        </button>
      </SearchBox>

      {isFocus && (
        <List ref={searchItemCnt}>
          {searchInput.length === 0 ? <RecentKeyword /> : <SearchResult />}
        </List>
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

const List = styled.ul`
  border: 1px solid rgb(194, 200, 206);
  border-radius: 20px;
  padding: 24px;
  padding-bottom: 16px;
  box-shadow: rgba(30, 32, 37, 0.1) 0px 2px 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Item = styled.li`
  list-style: none;
  cursor: pointer;
  &.focused {
    background: rgb(248, 249, 250);
  }
  &:hover {
    background: rgb(248, 249, 250);
  }
`

export default Search
