import { useState, useRef } from 'react'

import useCache, { fetchData, removeExpiredCache } from '../../api/useCache'
import { SearchData, RECENT_KEYWORDS } from '../../types'

const setRecentKeywords = (searchInput: string) => {
  if (sessionStorage.getItem(RECENT_KEYWORDS) !== null) {
    const arr = JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)
    sessionStorage.setItem(
      RECENT_KEYWORDS,
      JSON.stringify([...arr, searchInput])
    )
  } else {
    sessionStorage.setItem(RECENT_KEYWORDS, JSON.stringify([searchInput]))
  }
}

const useSearch = () => {
  const [isFocus, setIsFocus] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState<SearchData[]>([])
  const apiCallCnt = useRef(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const { fetchData, removeExpiredCache } = useCache()

  const goSearch = async (search: string) => {
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

    if (e.target.value === '') {
      return
    }

    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      await goSearch(e.target.value)
    }, 300)
  }

  return {
    onSubmitHandler,
    onChangeHanlder,
    isFocus,
    setIsFocus,
    searchResult,
    searchInput
  }
}

export default useSearch
