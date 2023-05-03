import React, { useState } from 'react'

import { KeywordListProps } from '../types/type'

import { List, ListItem, ListWrapper } from './KeywordListStyle'

const KeywordList: React.FC<KeywordListProps> = ({ results, onClick }) => {
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        if (selectedKeywordIndex > 0) {
          setSelectedKeywordIndex(selectedKeywordIndex - 1)
        }
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        if (selectedKeywordIndex < results.length - 1) {
          setSelectedKeywordIndex(selectedKeywordIndex + 1)
        }
        break
      }
      case 'Enter': {
        const selectedKeyword = results[selectedKeywordIndex]?.name || ''
        onClick(selectedKeyword)
        break
      }
      default:
        break
    }
  }
  const handleClick = (keyword: string) => {
    onClick(keyword)
  }

  return (
    <ListWrapper>
      <List onKeyDown={handleKeyDown} tabIndex={0}>
        {results.length == 0 && <p>검색어가 없습니다.</p>}
        {results.map((result, index) => (
          <ListItem
            key={result.id}
            onClick={() => handleClick(result.name)}
            selected={selectedKeywordIndex === index}
            tabIndex={-1}
          >
            {result.name}
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  )
}

export default KeywordList
