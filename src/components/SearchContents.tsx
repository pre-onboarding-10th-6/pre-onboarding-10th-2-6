import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import { SEARCH_ITEM } from '../types'

interface SearchContentsProp {
  result: SEARCH_ITEM[]
  loading: boolean
  selectedIdx: number
}

const validSearchKeyword = ({ result, selectedIdx }: SearchContentsProp) =>
  Array.isArray(result) &&
  result.slice(0, 6).map((item: SEARCH_ITEM, idx) => (
    <Item key={item.id} tabIndex={0} isSelected={idx === selectedIdx}>
      <SearchItem>
        <BiSearch className="search-icon" style={{ marginRight: '8px' }} />
        {item.name}
      </SearchItem>
    </Item>
  ))

const invalidSearchKeyword = () => <Text>검색어 없음</Text>

const SearchContents = ({
  result,
  loading,
  selectedIdx
}: SearchContentsProp) => {
  return (
    <SearchContentsLayout>
      <p className="recommend">추천 검색어</p>
      <>
        {result.length === 0
          ? invalidSearchKeyword()
          : validSearchKeyword({
              result,
              selectedIdx,
              loading
            })}
      </>
    </SearchContentsLayout>
  )
}

export default SearchContents

const SearchContentsLayout = styled.div`
  position: absolute;
  top: 115%;
  left: 0;
  width: 490px;
  height: 345px;
  padding: 20px 0;
  background-color: #fff;
  border: none;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  .recommend {
    font-size: 0.8rem;
    padding: 0 25px 12px;
  }
`

const Item = styled.div<{ isSelected: boolean }>`
  margin-bottom: 16px;
  padding: 12px 18px;
  background-color: ${({ isSelected }) => (isSelected ? '#f5f5f5' : '#fff')};
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`

const SearchItem = styled.div`
  display: flex;
  align-item: center;
`

const Text = styled.div`
  padding: 12px 24px;
`
