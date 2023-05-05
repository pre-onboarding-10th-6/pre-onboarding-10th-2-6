import { useState, useRef } from 'react'

import { setRecentKeywords } from './recentKeywords'

const useSearch = () => {
  const [searchInput, setSearchInput] = useState('')
  // const apiCallCnt = useRef(0)
  // const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // const searchAndGetResult = async (search: string) => {
  //   if (search === '') return []

  //   const URL = `${SEARCH_URL}${search}`
  //   const cache = await caches.open(SEARCH_STORAGE)
  //   const keys = await cache.keys()
  //   await removeExpiredCache(cache, keys)
  //   return await fetchData(cache, URL, apiCallCnt)
  // }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setRecentKeywords(searchInput)
    // fetch하고 그 결과를 useCache의 상태에 반영해야함

    // setSearchState({
    //   ...searchState,
    //   result: await searchAndGetResult(searchState.input)
    // })
  }

  // const onChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchState({ ...searchState, input: e.target.value })

  //   if (debounceRef.current !== null) clearTimeout(debounceRef.current)

  //   debounceRef.current = setTimeout(async () => {
  //     setSearchState({
  //       input: e.target.value,
  //       result: await searchAndGetResult(e.target.value)
  //     })
  //   }, 200)
  // }

  return {
    onSubmitHandler,
    searchInput
  }
}

export default useSearch
