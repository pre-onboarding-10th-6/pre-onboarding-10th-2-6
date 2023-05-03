import React from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import { IDisease } from '../types/disease'

interface IProps {
  suggestList: IDisease[]
}

const SuggestSearchList = ({ suggestList }: IProps) => {
  const renderList = () => {
    if (suggestList?.length === 0) {
      return <>검색어 없음</>
    }
    return (
      <>
        {suggestList?.map(item => {
          return (
            <li key={item.id}>
              <BiSearch size={12} />
              <span>{item.name}</span>
            </li>
          )
        })}
      </>
    )
  }
  return (
    <StSuggestListContainer>
      <StSuggestList>{suggestList && renderList()}</StSuggestList>
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
  li {
    padding: 4px 16px;
    font-size: 0.8rem;
    :hover {
      background-color: gray;
    }
  }
  svg {
    margin-right: 8px;
  }
`
