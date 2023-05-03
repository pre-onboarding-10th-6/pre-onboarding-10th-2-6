import { useState, useRef } from 'react'

import { SearchData, RECENT_KEYWORDS } from '../../types'

const isExpired = (response: Response) => {
  const cacheControl = response.headers.get('cache-control')
  const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 1
  const date = new Date(response.headers.get('date') as string).getTime()
  const expiration = date + maxAge * 1000
  const isExpired = Math.ceil(expiration - new Date().getTime())

  return isExpired < 0 ? true : false
}

const getNewResponse = (response: Response) => {
  const cacheControl = 'public, max-age=10'
  const headers = new Headers(response.headers)
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul'
  }
  headers.set('Cache-Control', cacheControl)
  headers.set('date', date.toLocaleString('en-US', options))
  return new Response(response.clone().body, {
    headers
  })
}

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

    if (keys.length) {
      await Promise.all(
        keys.map(async request => {
          const response = await cache.match(request)
          if (response && isExpired(response)) {
            await cache.delete(request)
            return null
          }
          return response
        })
      )
    }

    const existingCache = await cache.match(URL)

    let result = []
    if (existingCache) {
      console.log('cache exist')
      result = await existingCache.json() // get data
    } else {
      console.log('cache does not exist')
      result = await fetch(URL).then(response => {
        const responseWithHeader = getNewResponse(response)
        cache.put(URL, responseWithHeader)
        console.info(`Search API 호출 횟수 : ${(apiCallCnt.current += 1)}`)
        return response.json()
      })
    }
    setSearchResult(result)
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
