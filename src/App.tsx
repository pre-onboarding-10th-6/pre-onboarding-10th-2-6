import React, { useState } from 'react'

import { getDisease } from './service/getDisease'

function App() {
  const [searchInput, setSearchInput] = useState('')

  const onChangeSearchInput = async (e: any) => {
    setSearchInput(e.target.value)
    const { data } = await getDisease(e.target.value)
    return data
  }

  return (
    <>
      <div>
        <input type="text" onChange={onChangeSearchInput} />
        <button>검색</button>
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
