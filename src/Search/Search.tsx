import { useState } from 'react'
import styled from 'styled-components'

import useCache from '../hooks/useCache'
import useDebouncer from '../hooks/useDebounce'
import useKeyboard from '../hooks/useKeyboard'
import { ReactComponent as IconSearch } from '../icons/IconSearch.svg'

import { getRecentKeywords, setRecentKeywords } from './recentKeywords'
import SearchList from './SearchList'

const Search = () => {
  const [isFocus, setIsFocus] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const debouncedInput = useDebouncer(searchInput, 200)
  const { cachedData, removeExpiredCache, fetchData } = useCache({
    cacheStorageName: 'search',
    searchInput: debouncedInput
  })
  const { focusIndex, searchItemCnt, onKeyDownHandler } = useKeyboard(
    async () => {
      console.log(`enter passing : ${cachedData} ${debouncedInput}`)
      const autoSearch =
        debouncedInput.length === 0
          ? getRecentKeywords()[focusIndex]
          : cachedData[focusIndex - 1].name
      setRecentKeywords(autoSearch)
      setSearchInput(autoSearch)
    }
  )

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRecentKeywords(debouncedInput)
    await removeExpiredCache('search')
    await fetchData('search', searchInput)
  }

  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  return (
    <Form
      onSubmit={e =>
        searchInput === '' ? alert('값을 입력해주세요') : onSubmitHandler(e)
      }
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
        <SearchList
          debouncedInput={debouncedInput}
          cachedData={cachedData ? cachedData : []}
          focusedItem={focusIndex}
          searchItemCnt={searchItemCnt}
        />
      )}
    </Form>
  )
}

const Form = styled.form`
  max-width: 1024px;
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
