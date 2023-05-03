import { useState, useRef } from 'react'

import { SEARCH_URL, SEARCH_STORAGE } from '../../api/cache'
import { fetchData, removeExpiredCache } from '../../api/cache'
import { RECENT_KEYWORDS, SearchState } from '../../types'

const setRecentKeywords = (search: string) => {
  if (sessionStorage.getItem(RECENT_KEYWORDS) !== null) {
    const arr = JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)
    sessionStorage.setItem(
      RECENT_KEYWORDS,
      JSON.stringify([search, ...arr.splice(0, 6)])
    )
  } else {
    sessionStorage.setItem(RECENT_KEYWORDS, JSON.stringify([search]))
  }
}

const useSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    input: '',
    result: []
  })
  const [focusedItem, setFocusedItem] = useState(-1)
  const apiCallCnt = useRef(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const searchItemCnt = useRef<HTMLUListElement | null>(null)

  const searchAndGetResult = async (search: string) => {
    if (search === '') {
      console.log('SEARCHasdasdnuiadsbjdashbads')
      // return
    }

    const URL = `${SEARCH_URL}${search}`
    const cache = await caches.open(SEARCH_STORAGE)
    const keys = await cache.keys()
    await removeExpiredCache(cache, keys)
    const result = await fetchData(cache, URL, apiCallCnt)
    return result
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchState.input.length === 0) {
      alert('값을 입력해주세요')
      return
    }

    setRecentKeywords(searchState.input)
    const result = await searchAndGetResult(searchState.input)
    setSearchState({ ...searchState, result })
  }

  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState({ ...searchState, input: e.target.value })

    if (e.target.value === '') return
    if (debounceRef.current !== null) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const result = await searchAndGetResult(e.target.value)
      if (result !== undefined) {
        setSearchState({ input: e.target.value, result })
      }
    }, 200)
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
          // focus가 0,-1일 땐 break하고 기본동작(onSubmitHandler)을 취함
          if (focusedItem <= 0) {
            break
          }
          e.preventDefault()
          const autoSearch = searchState.result[focusedItem - 1].name
          setRecentKeywords(autoSearch)
          const result = await searchAndGetResult(autoSearch)
          setSearchState({ result, input: autoSearch })
          setFocusedItem(-1)
          break
      }
    }
  }

  const onMouseDownHandler = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    let search
    if (e.currentTarget.childNodes[2] === undefined) {
      search = e.currentTarget.childNodes[1].textContent
    } else {
      search =
        e.currentTarget.childNodes[1].textContent +
        '' +
        e?.currentTarget?.childNodes[2].textContent
    }
    console.log('click')
    console.log(search)
    if (typeof search === 'string') {
      setRecentKeywords(search)
      const result = await searchAndGetResult(search)
      setSearchState({ result, input: search })
    }
  }

  return {
    onSubmitHandler,
    onChangeHanlder,
    onKeyDownHandler,
    onMouseDownHandler,
    focusedItem,
    searchState,
    searchItemCnt
  }
}

export default useSearch
