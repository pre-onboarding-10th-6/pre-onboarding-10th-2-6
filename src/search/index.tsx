import { useState } from 'react'
import styled from 'styled-components'

import useCache from '../hooks/useCache'
import { SEARCH_STORAGE } from '../hooks/useCache'
import useClickOutside from '../hooks/useClickOutside'
import useKeyboard from '../hooks/useKeyboard'
import { SearchData } from '../types'
import { getRecentKeywords, setRecentKeywords } from '../utils/recentKeywords'

import Dropdown from './Dropdown'
import SearchBar from './SearchBar'

interface Search {
  input: string
  cachedData: SearchData[]
}

const Search = () => {
  const [searchInput, setSearchInput] = useState('')
  const { ref, isFocus, onFocusHandler } = useClickOutside()
  const { cachedData, fetchCached, fetchDebounced } = useCache(SEARCH_STORAGE)

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
      setSearchInput(autoSearch === undefined ? '' : autoSearch)
      fetchCached(autoSearch, true)
    }
  })

  // Form
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchCached(searchInput, true)
  }

  // SearchBar
  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    fetchDebounced(e.target.value, false)
  }

  // Dropdown
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
      setSearchInput(search)
      fetchCached(search, true)
    }
  }

  return (
    <Form ref={ref} onSubmit={onSubmitHandler} onFocus={onFocusHandler}>
      <SearchBar
        onChange={onChangeHanlder}
        onKeyDown={onKeyDownHandler}
        value={searchInput}
      />

      {isFocus && (
        <Dropdown
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

export default Search
