import { useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'
import { SerachData } from '../../types'

const Search = () => {
  const [searchInput, setSearchInput] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [searchResult, setSearchResult] = useState<SerachData[]>([])

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const URL = `http://localhost:3000/api/v1/search-conditions/?name=${searchInput}`
    const cache = await caches.open('search')
    const existingCache = await cache.match(URL)

    // Session Storage에 최근 검색어 저장하기

    if (existingCache) {
      console.log('cache exist')
      const result = await existingCache.json() // get data
      console.log(result)
      setSearchResult(result)
    } else {
      console.log('cache does not exist')
      const res = await fetch(URL).then(response => {
        cache.put(URL, response)
        return response.json()
      })
      console.log(res) // get data
      setSearchResult(res)
    }
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  return (
    <Form onSubmit={onSubmitHandler}>
      <SearchBox>
        <IconSearch />
        <input
          type="search"
          value={searchInput}
          onChange={onChangeHanlder}
          onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          placeholder="질환명을 입력해 주세요."
        />
        {/* <IconX /> */}
        <button>검색</button>
      </SearchBox>

      {isFocus && (
        <SearchList>
          {searchResult.length === 0
            ? '데이터가 없습니다'
            : searchResult.map(arr => <div key={arr.id}>{arr?.name}</div>)}
        </SearchList>
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
      background: red;
      cursor: pointer;
    }
  }
`

const SearchList = styled.div`
  border: 1px solid rgb(194, 200, 206);
  border-radius: 20px;
  padding: 24px;
  padding-bottom: 16px;
  box-shadow: rgba(30, 32, 37, 0.1) 0px 2px 10px;
`

const IconX = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  font-size: 16px;
  background-color: black;
  border-radius: 50%;
  &:after {
    width: 24px;
    height: 24px;
    display: inline-block;
    content: '\00d7';
    font-size: 15px;
  }
`

export default Search
