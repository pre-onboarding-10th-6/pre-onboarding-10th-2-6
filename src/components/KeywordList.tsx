import React, { useEffect, useRef } from 'react'

import { KeywordListProps } from '../types/type'

import { List, ListItem, ListWrapper } from './KeywordListStyle'

const KeywordList: React.FC<KeywordListProps> = ({
  results,
  onClick,
  onKeyDown,
  selectedIndex
}) => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([])

  const handleClick = (keyword: string) => {
    onClick(keyword)
  }

  useEffect(() => {
    if (listRefs?.current && listRefs?.current[selectedIndex]) {
      listRefs?.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'auto'
      })
    }
  }, [selectedIndex])

  return (
    <ListWrapper>
      <List onKeyDown={onKeyDown} tabIndex={0}>
        {results.length == 0 && <p>검색어가 없습니다.</p>}
        {results?.map((result, index) => (
          <ListItem
            key={result.id}
            onClick={() => handleClick(result.name)}
            selected={selectedIndex === index}
            tabIndex={-1}
            ref={el => (listRefs.current[index] = el)}
          >
            {result.name}
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  )
}

export default KeywordList
