import React from 'react';

import Styled from './style';

type Props = {
  searchInput: string;
  searchOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function SearchInputBox({ searchInput, searchOnChange, handleKeyDown }: Props) {
  return <Styled.SearchBar>
    <Styled.SearchInput type="text" value={searchInput} onChange={searchOnChange} onKeyDown={handleKeyDown} />
    <Styled.Button>검색</Styled.Button>
  </Styled.SearchBar>;
}
