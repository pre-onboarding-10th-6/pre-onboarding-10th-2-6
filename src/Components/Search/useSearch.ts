import { useState, useRef } from 'react'

import { SearchData, RECENT_KEYWORDS } from '../../types'

const setRecentKeywords = (searchInput: string) => {
  // Session Storage에 최근 검색어 저장하기
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

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput.length === 0) {
      alert('값을 입력해주세요')
      return
    }

    const URL = `http://localhost:3000/api/v1/search-conditions/?name=${searchInput}`
    const cache = await caches.open('search')
    const existingCache = await cache.match(URL)
    setRecentKeywords(searchInput)

    if (existingCache) {
      console.log('cache exist')
      const result = await existingCache.json() // get data
      console.log(result)
      setSearchResult(result)
    } else {
      console.log('cache does not exist')
      const res = await fetch(URL).then(response => {
        cache.put(URL, response)
        console.info(`Search API 호출 횟수 : ${(apiCallCnt.current += 1)}`)
        return response.json()
      })
      console.log(res) // get data
      setSearchResult(res)
    }
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
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
