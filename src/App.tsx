import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { color } from './assets/colors'
import SearchBar from './components/SearchBar'
import SuggestSearchList from './components/SuggestSearchList'
import useDebounce from './hooks/useDebounce'
import { getDisease } from './service/getDisease'
import { IDisease } from './types/disease'

function App() {
  const [searchInput, setSearchInput] = useState<string>('')
  const [suggestList, setSuggestList] = useState<IDisease[]>()
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)

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

  return (
    <StLayout>
      <StSearchContainer>
        <StTitle>
          국내 모든 임상시험 검색하고
          <br /> 온라인으로 참여하기
        </StTitle>
        <SearchBar
          suggestList={suggestList}
          setSearchInput={setSearchInput}
          selectedIdx={selectedIdx}
          setSelectedIdx={setSelectedIdx}
        />
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
  background-color: ${color.BACKGROUND};
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

  background-color: ${color.WHITE};
  border: 1px solid ${color.LIGHT_GRAY};
  border-radius: 30px;
  padding: 10px;
  margin-bottom: 8px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: ${color.WHITE};
    background-color: ${color.BUTTON};
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
