import { useState, useRef } from 'react'

import { fetchData, removeExpiredCache } from '../../api/cache'
import { SearchData, RECENT_KEYWORDS } from '../../types'

const setRecentKeywords = (searchInput: string) => {
  if (sessionStorage.getItem(RECENT_KEYWORDS) !== null) {
    const arr = JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)
    sessionStorage.setItem(
      RECENT_KEYWORDS,
      JSON.stringify([searchInput, ...arr.splice(0, 6)])
    )
  } else {
    sessionStorage.setItem(RECENT_KEYWORDS, JSON.stringify([searchInput]))
  }
}

const useSearch = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState<SearchData[]>([])
  const [focusedItem, setFocusedItem] = useState(-1)
  const apiCallCnt = useRef(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const searchItemCnt = useRef<HTMLUListElement | null>(null)

  const goSearch = async (search: string) => {
    if (search === '') return

    const URL = `http://localhost:3000/api/v1/search-conditions/?name=${search}`
    const cache = await caches.open('search')
    const keys = await cache.keys()
    await removeExpiredCache(cache, keys)
    const result = await fetchData(cache, URL, apiCallCnt)
    setSearchResult(result)
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput.length === 0) {
      alert('값을 입력해주세요')
      return
    }

    setRecentKeywords(searchInput)
    await goSearch(searchInput)
  }

  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)

    if (e.target.value === '') return
    if (debounceRef.current !== null) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      await goSearch(e.target.value)
    }, 300)
  }

  const onKeyDownHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchItemCnt.current) {
      const maxIdx = searchItemCnt.current.childElementCount - 1
      switch (e.key) {
        case 'ArrowUp':
          if (focusedItem === 0) {
            setFocusedItem(-1)
          } else if (focusedItem === -1) {
            setFocusedItem(maxIdx - 1)
          } else {
            setFocusedItem(prev => prev - 1)
          }
          break
        case 'ArrowDown':
          focusedItem > maxIdx - 1
            ? setFocusedItem(-1)
            : setFocusedItem(prev => prev + 1)
          break
        case 'Enter':
          if (focusedItem <= 0) {
            // focus가 0,-1일 땐 break하고 기본동작(onSubmitHandler)을 취함
            break
          }
          e.preventDefault()
          const autoSearch = searchResult[focusedItem - 1].name
          setRecentKeywords(autoSearch)
          await goSearch(autoSearch)
          setSearchInput(autoSearch)
          setFocusedItem(-1)
          break
      }
    }
  }

  const onMouseDownHandler = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    console.log('click')
    const search = e.currentTarget.childNodes[1].nodeValue
    if (typeof search === 'string') {
      setRecentKeywords(search)
      await goSearch(search)
      setSearchInput(search)
    }
  }

  return {
    onSubmitHandler,
    onChangeHanlder,
    onKeyDownHandler,
    onMouseDownHandler,
    focusedItem,
    searchResult,
    searchInput,
    searchItemCnt
  }
}

export default useSearch
