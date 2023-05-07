import { useState } from 'react'
import styled from 'styled-components'

import useCache from '../hooks/useCache'
import { SEARCH_STORAGE } from '../hooks/useCache'
import useClickOutside from '../hooks/useClickOutside'
import useDebouncer from '../hooks/useDebounce'
import useKeyboard from '../hooks/useKeyboard'
import { ReactComponent as IconSearch } from '../icons/IconSearch.svg'
import { getRecentKeywords, setRecentKeywords } from '../utils/recentKeywords'

import SearchList from './SearchList'

const Search = () => {
  const [searchInput, setSearchInput] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const { ref } = useClickOutside(() => setIsFocus(false))
  const { cachedData, fetchCached } = useCache(SEARCH_STORAGE)
  const debounce = useDebouncer(fetchCached, 300)
  const { focusIndex, searchItemCnt, onKeyDownHandler } = useKeyboard({
    onEnter() {
      let autoSearch
      if (searchInput.length === 0) {
        if (focusIndex === -1) {
          alert('값을 입력해주세요')
          return
        }
        autoSearch = getRecentKeywords()[focusIndex]
      } else {
        autoSearch = cachedData[focusIndex - 1]?.name
      }
      setRecentKeywords(autoSearch)
      setSearchInput(autoSearch === undefined ? '' : autoSearch)
      fetchCached(autoSearch)
    }
  })

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRecentKeywords(searchInput)
    fetchCached(searchInput)
  }

  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    debounce(value)
  }

  const onMouseDownHandler = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const { currentTarget } = event
    const titleElement = currentTarget.childNodes[1] as HTMLElement
    const subtitleElement = currentTarget.childNodes[2] as
      | HTMLElement
      | undefined

    const title = titleElement?.textContent?.trim() ?? ''
    const subTitle = subtitleElement?.textContent?.trim() ?? ''
    const search = `${title} ${subTitle}`.trim()

    if (search.length > 0) {
      setRecentKeywords(search)
      fetchCached(search)
      setSearchInput(search)
    }
  }

  return (
    <Form ref={ref} onSubmit={onSubmitHandler} onFocus={() => setIsFocus(true)}>
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
          searchInput={searchInput}
          cachedData={cachedData ? cachedData : []}
          focusIndex={focusIndex}
          searchItemCnt={searchItemCnt}
          onMouseDownHandler={onMouseDownHandler}
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
