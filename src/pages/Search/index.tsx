import styled from 'styled-components'

import { Input } from '../../components/Input'
import useInputs from '../../hooks/useInputs'
import useKeyHandler from '../../hooks/useKeyHandler'
import useSearchHandler from '../../hooks/useSearchHandler'
import { SEARCH_ITEM } from '../../types'

const Search = () => {
  const {
    values: { searchKeyword },
    handleChange
  } = useInputs({ searchKeyword: '' })
  const { result, loading } = useSearchHandler(searchKeyword)
  const { handleKeyUpDown, selectedIdx } = useKeyHandler(result)

  return (
    <main>
      <InputWrap>
        <Input
          id="searchInput"
          type="text"
          name="searchKeyword"
          color="#333"
          placeholder=""
          value={searchKeyword}
          onChange={handleChange}
          onKeyDown={handleKeyUpDown}
        >
          {loading ? (
            <div>검색중...</div>
          ) : (
            Array.isArray(result) &&
            result.map((item: SEARCH_ITEM, idx) => (
              <Item key={item.id} tabIndex={0} isSelected={idx === selectedIdx}>
                {item.name}
              </Item>
            ))
          )}
        </Input>
      </InputWrap>
      <button>검색</button>
    </main>
  )
}

export default Search

const InputWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-right: 8px;
  background-color: #ffffff;
  font-weight: 400;
  font-size: 1rem;
  border: 2px solid;
  border-color: #ffffff;
  border-radius: 42px;
  line-height: 1.6;
  letter-spacing: -0.018em;
`

const Item = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? '#ddd' : '#fff')};
`
