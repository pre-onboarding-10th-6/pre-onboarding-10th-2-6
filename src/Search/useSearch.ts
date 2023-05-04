import { useState, useRef } from 'react'

import { SEARCH_URL, SEARCH_STORAGE } from '../api/cache'
import { fetchData, removeExpiredCache } from '../api/cache'
import { RECENT_KEYWORDS, SearchState } from '../types'

import { setRecentKeywords } from './recentKeywords'

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
    if (search === '') return []

    const URL = `${SEARCH_URL}${search}`
    const cache = await caches.open(SEARCH_STORAGE)
    const keys = await cache.keys()
    await removeExpiredCache(cache, keys)
    return await fetchData(cache, URL, apiCallCnt)
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setRecentKeywords(searchState.input)
    setSearchState({
      ...searchState,
      result: await searchAndGetResult(searchState.input)
    })
  }

  const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState({ ...searchState, input: e.target.value })

    if (debounceRef.current !== null) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setSearchState({
        input: e.target.value,
        result: await searchAndGetResult(e.target.value)
      })
    }, 200)
  }

  const onKeyDownHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchItemCnt.current) return

    const maxIdx = searchItemCnt.current.childElementCount - 1
    const { key } = e
    const breakAndSubmit =
      key === 'Enter' &&
      (searchState.input.length === 0 ? focusedItem === -1 : focusedItem <= 0)

    if (breakAndSubmit) return

    if (key === 'ArrowUp') {
      setFocusedItem(prev => (prev === -1 ? maxIdx - 1 : prev - 1))
    } else if (key === 'ArrowDown') {
      setFocusedItem(prev => (prev === maxIdx - 1 ? -1 : prev + 1))
    } else if (key === 'Enter') {
      e.preventDefault()
      const autoSearch =
        searchState.input.length === 0
          ? JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)[
              focusedItem
            ]
          : searchState.result[focusedItem - 1].name

      setRecentKeywords(autoSearch)
      setSearchState({
        result: await searchAndGetResult(autoSearch),
        input: autoSearch
      })
      setFocusedItem(-1)
    }
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
      setSearchState({
        result: await searchAndGetResult(search),
        input: search
      })
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
