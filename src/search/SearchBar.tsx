import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../icons/IconSearch.svg'

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  value: string
}

const SearchBar = ({ onChange, onKeyDown, value }: Props) => {
  return (
    <SearchBox>
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="질환명을 입력해 주세요."
      />
      <button>
        <IconSearch />
      </button>
    </SearchBox>
  )
}

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgb(194, 200, 206);
  border-radius: 42px;
  padding: 12px 20px;
  gap: 8px;
  input {
    font-size: 16px;
    flex: 1 1 80%;
    outline: none;
    border: none;
    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      cursor: pointer;
    }
  }
  button {
    display: contents;
  }
`

export default SearchBar
