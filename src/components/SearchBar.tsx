import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

interface SearchBarProps {
  labelText?: string
  searchKeyword: string
  isFocused: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleKeyUpDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleFocus: () => void
  handleBlur: () => void
}

const SearchBar = ({
  labelText,
  searchKeyword,
  isFocused,
  handleChange,
  handleKeyUpDown,
  handleFocus,
  handleBlur
}: SearchBarProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <SearchBarContainer onSubmit={handleSubmit} isFocused={isFocused}>
      <BiSearch className="search-icon" />
      <label htmlFor="search">{labelText ? labelText : ''}</label>
      <input
        type="text"
        id="search"
        value={searchKeyword}
        onChange={handleChange}
        onKeyDown={handleKeyUpDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="질환명을 입력해 주세요."
      />
      <button type="submit">
        <BiSearch size={30} />
      </button>
    </SearchBarContainer>
  )
}

const SearchBarContainer = styled.form<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  background: #fff;
  border-radius: 50px;
  outline: ${({ isFocused }) => (isFocused ? '2px solid #007be9' : 'none')};

  input {
    flex: 1;
    font-size: 1.2rem;
    &:focus {
      outline: none;
    }
  }

  button {
    width: 50px;
    height: 50px;
    margin: 0 10px;
    border-radius: 50%;
    background: #007be9;
    color: #fff;
    cursor: pointer;
  }

  .search-icon {
    margin: 0px 15px 0px 25px;
  }
`

export default SearchBar
