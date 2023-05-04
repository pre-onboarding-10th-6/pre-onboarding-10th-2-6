import React from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import useScrollToSelected from '../hooks/useScrollToSelected'
import { Suggestion } from '../types/search'

const SearchSuggestionsLayout = styled.ul`
  position: absolute;
  width: 100%;
  padding: 25px 0;
  margin: 10px 0 0 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  ul {
    overflow-y: scroll;
    max-height: 200px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 25px;
    cursor: pointer;
  }
  li.focus,
  li:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  li p {
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 2.5;
  }
  li .icon {
    margin: 0 15px 0 0;
  }

  .title {
    font-size: 0.8rem;
    padding: 0 25px 12px;
  }

  .empty {
    padding: 0 0 0 25px;
  }
`

interface SearchSuggestionsProps {
  suggestions: Suggestion[]
  focusIndex: number
  handleChangeKeyword: (
    e: React.MouseEvent<HTMLLIElement>,
    newKeyword: string
  ) => void
}

const SearchSuggestions = ({
  suggestions,
  focusIndex,
  handleChangeKeyword
}: SearchSuggestionsProps) => {
  const ulRef = useScrollToSelected(focusIndex)
  return (
    <SearchSuggestionsLayout>
      <p className="title">추천 검색어</p>
      <ul ref={ulRef}>
        {suggestions.length ? (
          suggestions.map(({ id, name }, index) => (
            <li
              key={id}
              className={focusIndex === index ? 'focus' : ''}
              onMouseDown={e => handleChangeKeyword(e, name)}
            >
              <BiSearch size={20} className="icon" />
              <p>{name}</p>
            </li>
          ))
        ) : (
          <p className="empty">검색어 없음</p>
        )}
      </ul>
    </SearchSuggestionsLayout>
  )
}

export default SearchSuggestions
