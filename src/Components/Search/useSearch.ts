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
  const { fetchData, removeExpiredCache } = useCache()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput.length === 0) {
      alert('값을 입력해주세요')
      return
    }

    setRecentKeywords(searchInput)

    const URL = `http://localhost:3000/api/v1/search-conditions/?name=${searchInput}`
    const cache = await caches.open('search')
    const keys = await cache.keys()

    await removeExpiredCache(cache, keys)
    const result = await fetchData(cache, URL, apiCallCnt)
    setSearchResult(result)
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)

    // 디바운싱으로 검색 API 호출
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
