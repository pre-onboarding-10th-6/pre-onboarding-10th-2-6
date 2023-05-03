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
    if (debounceInput === '') {
      setSuggestList(undefined)
      return
    }
    try {
      const data = await getDisease(debounceInput)
      setSuggestList(data)
    } catch (error) {
      console.error(error)
      setSuggestList(undefined)
    }
  }, [debounceInput])

  useEffect(() => {
    getDiseaseList()
  }, [getDiseaseList])

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchInput(value)
  }
  const renderList = () => {
    if (suggetList?.length === 0) {
      return <>검색어 없음</>
    }
    return (
      <>
        {suggetList?.map(item => {
          return <p key={item.id}>{item.name}</p>
        })}
      </>
    )
  }
  console.log(suggetList)
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
        {suggetList && renderList()}
      </div>
    </>
  )
}

export default App
