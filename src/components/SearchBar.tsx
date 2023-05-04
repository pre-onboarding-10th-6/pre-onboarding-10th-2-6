import React from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import { color } from '../assets/colors'
import { IDisease } from '../types/disease'

const SearchBar = ({
  suggestList,
  setSearchInput,
  selectedIdx,
  setSelectedIdx
}: {
  suggestList: IDisease[] | undefined
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  selectedIdx: number
  setSelectedIdx: React.Dispatch<React.SetStateAction<number>>
}) => {
  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchInput(value)
  }

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
  return (
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
  )
}

export default SearchBar

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
