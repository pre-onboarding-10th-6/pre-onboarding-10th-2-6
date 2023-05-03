import React, { useCallback, useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import SuggestSearchList from './components/SuggestSearchList'
import useDebounce from './hooks/useDebounce'
import { getDisease } from './service/getDisease'
import { IDisease } from './types/disease'

function App() {
  const [searchInput, setSearchInput] = useState<string>('')
  const [suggestList, setSuggestList] = useState<IDisease[]>()
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)

  const debounceInput = useDebounce(searchInput)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestList) {
      return
    }
    if (e.key === 'ArrowUp') {
      const arrowUpIndex = Math.max(selectedIdx - 1, -1)
      setSelectedIdx(arrowUpIndex)
    } else if (e.key === 'ArrowDown') {
      const arrowDownIndex = Math.min(selectedIdx + 1, suggestList.length - 1)
      setSelectedIdx(arrowDownIndex)
    }
  }

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

  return (
    <StLayout>
      <StSearchContainer>
        <StTitle>
          국내 모든 임상시험 검색하고
          <br /> 온라인으로 참여하기
        </StTitle>
        <StInputContainer>
          <StInputWrap>
            <BiSearch size={20} />
            <input
              type="text"
              onChange={onChangeSearchInput}
              onKeyDown={handleKeyDown}
              placeholder="질환명을 입력해 주세요."
            />
          </StInputWrap>
          <button>
            <BiSearch size={20} />
          </button>
        </StInputContainer>
        {suggestList && (
          <SuggestSearchList
            suggestList={suggestList}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
          />
        )}
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
  height: 500px;
  margin: 150px 0;
`
const StTitle = styled.h2`
  font-size: 1.5rem;
  line-height: 120%;
  margin-bottom: 30px;
`

const StInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  background-color: white;
  border: 1px solid lightgray;
  border-radius: 30px;
  padding: 10px;
  margin-bottom: 8px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: white;
    background-color: #007be9;
    border-radius: 100%;
  }
`
const StInputWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 30px;
  input {
    width: 100%;
  }
`
