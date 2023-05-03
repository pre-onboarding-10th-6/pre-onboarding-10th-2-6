import React, { useCallback, useEffect, useState } from 'react'

import { getDisease } from './service/getDisease'
import { IDisease } from './types/disease'

function App() {
  const [searchInput, setSearchInput] = useState<string>('')
  const [debounceInput, setDebouncInput] = useState<string>('')
  const [suggetList, setSuggestList] = useState<IDisease[]>()

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
    setSuggestList(data)
  }, [debounceInput])

  useEffect(() => {
    getDiseaseList()
  }, [getDiseaseList])

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {suggetList &&
          suggetList.map(item => {
            return <p key={item.id}>{item.name}</p>
          })}
      </div>
    </>
  )
}

export default App
