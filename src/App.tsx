import React, { useCallback, useEffect, useState } from 'react'

import { getDisease } from './service/getDisease'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [debounceInput, setDebouncInput] = useState('')

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncInput(searchInput)
    }, 500)
    return () => {
      clearTimeout(id)
    }
  }, [searchInput])

  const getDiseaseList = useCallback(async () => {
    const data = await getDisease(debounceInput)
    console.log(data)
  }, [debounceInput])

  useEffect(() => {
    getDiseaseList()
  }, [getDiseaseList])

  const onChangeSearchInput = (e: any) => {
    const { value } = e.target
    setSearchInput(value)
  }

  return (
    <>
      <div>
        <input type="text" onChange={onChangeSearchInput} />
        <button>검색</button>
        {debounceInput}
      </div>
      <div>
        <p>간세포암</p>
        <p>간세포암</p>
        <p>간세포암</p>
        <p>간세포암</p>
      </div>
    </>
  )
}

export default App
