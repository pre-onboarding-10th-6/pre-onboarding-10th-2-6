import React, { useRef } from 'react';

import Styled from './style';

type Props = { searchResult: Condition[], focusedItem: Condition }
const SearchResultList = ({ searchResult, focusedItem }: Props) => {
  return <Styled.ResultContainer>
    <div style={{
      fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem"
    }}>추천 검색어</div>
    {searchResult.map((item) => (
      <SearchConditionsItem key={item.id} condition={item} focused={focusedItem.id === item.id} />
    ))}
  </Styled.ResultContainer>
};

const SearchConditionsItem = ({ condition, focused }: { condition: Condition; focused: boolean; }) => {
  const ref = useRef<HTMLDivElement>(null)

  if (focused)
    ref.current?.scrollIntoView({ block: "nearest" })

  return (
    <Styled.ResultRow style={{ backgroundColor: focused ? "#dde" : "#eee" }} ref={ref}>
      <span>🔍</span>
      <span>{condition.name}</span>
    </Styled.ResultRow>
  );
};

export default SearchResultList;
