import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import { IDisease } from '../types/disease'

interface IProps {
  suggestList: IDisease[]
  selectedIdx: number
  setSelectedIdx: Dispatch<SetStateAction<number>>
}

const SuggestSearchList = ({
  suggestList,
  selectedIdx,
  setSelectedIdx
}: IProps) => {
  const suggestListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (suggestListRef.current && selectedIdx !== -1) {
      const selectedEl = suggestListRef.current.children[
        selectedIdx
      ] as HTMLLIElement
      const listContainerRect = suggestListRef.current.getBoundingClientRect()
      const selectedItemRect = selectedEl.getBoundingClientRect()

      if (selectedItemRect.bottom > listContainerRect.bottom) {
        suggestListRef.current.scrollTop +=
          selectedItemRect.bottom - listContainerRect.bottom
      } else if (selectedItemRect.top < listContainerRect.top) {
        suggestListRef.current.scrollTop -=
          listContainerRect.top - selectedItemRect.top
      }
    } else if (suggestListRef.current) {
      suggestListRef.current.scrollTop = 0
    }
  }, [selectedIdx])

  const renderList = () => {
    if (suggestList?.length === 0) {
      return <>검색어 없음</>
    }
    return (
      <>
        {suggestList.map((item, idx) => {
          return (
            <StLi
              key={item.id}
              onMouseEnter={() => setSelectedIdx(idx)}
              onMouseLeave={() => setSelectedIdx(-1)}
              isActive={selectedIdx === idx}
            >
              <BiSearch size={12} />
              <span>{item.name}</span>
            </StLi>
          )
        })}
      </>
    )
  }
  return (
    <StSuggestListContainer>
      <StSuggestList ref={suggestListRef}>
        {suggestList && renderList()}
      </StSuggestList>
    </StSuggestListContainer>
  )
}

export default SuggestSearchList

const StSuggestListContainer = styled.div`
  text-align: left;
  width: 360px;
  background-color: white;
  border-radius: 10px;
  padding: 16px 0 0;
`
const StSuggestList = styled.ul`
  overflow-y: scroll;
  max-height: 200px;
  svg {
    margin-right: 8px;
  }
`

interface IStLiProps {
  readonly isActive: boolean
}
const StLi = styled.li<IStLiProps>`
  padding: 4px 16px;
  font-size: 0.8rem;
  background-color: ${props => (props.isActive ? 'red' : 'green')};
`
