import React, { useCallback, useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import useDebounce from './hooks/useDebounce'
import { getDisease } from './service/getDisease'
import { IDisease } from './types/disease'

function App() {
  const [searchInput, setSearchInput] = useState<string>('')
  const [suggestList, setSuggestList] = useState<IDisease[]>()
  const debounceInput = useDebounce(searchInput)

  const getDiseaseList = useCallback(async () => {
    if (debounceInput === '') {
      setSuggestList(undefined)
      return
    }
    try {
      const data = await getDisease(debounceInput)
      setSuggestList(data)
      console.info('calling api')
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
    if (suggestList?.length === 0) {
      return <>검색어 없음</>
    }
    return (
      <>
        {suggestList?.map(item => {
          return <p key={item.id}>{item.name}</p>
        })}
      </>
    )
  }

  return (
    <StLayout>
      <StSearchContainer>
        <h2>국내 모든 임상시험 검색하고</h2>
        <h2>온라인으로 참여하기</h2>
        <StInputContainer>
          <BiSearch size={20} />
          <input
            type="text"
            onChange={onChangeSearchInput}
            placeholder="질환명을 입력해 주세요."
          />
          <button>
            <BiSearch size={30} />
          </button>

          {/* {debounceInput} */}
        </StInputContainer>
        <StSuggestListContainer>
          {suggestList &&
            suggestList.map(item => {
              return <div key={item.id}>{item.name}</div>
            })}
          {suggestList && renderList()}
        </StSuggestListContainer>
      </StSearchContainer>
    </StLayout>
  )
}

export default App

const StLayout = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: #cae9ff;
`

const StSearchContainer = styled.div`
  width: 360px;
  height: 500px;
  margin: 150px 0;
  h2 {
    font-size: 1.5rem;
    padding: 10px;
  }
`

const StInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 360px;
  /* margin-top: 100px; */

  input {
    width: 100%;
    height: 30px;
    border: 1px solid lightgray;
    border-radius: 20px;
    padding: 10px;
  }

  button {
    position: absolute;
    right: 0;
    color: white;
    background-color: #007be9;
    border-radius: 100%;
  }
`

const StSuggestListContainer = styled.div`
  text-align: left;
  width: 360px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  overflow-y: scroll;
  max-height: 200px;
  font-size: 0.8rem;
`
