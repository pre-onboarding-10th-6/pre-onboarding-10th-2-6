import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'

import { SEARCH_ITEM } from '../types'

interface SearchContentsProp {
  result: SEARCH_ITEM[]
  loading: boolean
  selectedIdx: number
  searchKeyword?: string
  handleChangeKeyword: (
    e: React.MouseEvent<HTMLLIElement>,
    newKeyword: string
  ) => void
}

const SearchContents = ({
  result,
  selectedIdx,
  handleChangeKeyword,
  searchKeyword
}: SearchContentsProp) => {
  if (!searchKeyword) {
    return (
      <SearchContentsLayout>
        <p className="recommend">추천 검색어</p>
        <Text>검색어 없음</Text>
      </SearchContentsLayout>
    )
  }
  return (
    <SearchContentsLayout>
      <p className="recommend">추천 검색어</p>
      <ul>
        {result.length ? (
          result.slice(0, 6).map(({ id, name }, index) => (
            <Item
              key={id}
              isSelected={index === selectedIdx}
              onMouseDown={e => handleChangeKeyword(e, name)}
            >
              <SearchItem>
                <BiSearch className="search-icon" />
                {name}
              </SearchItem>
            </Item>
          ))
        ) : (
          <Text>검색어 없음</Text>
        )}
      </ul>
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

const Item = styled.li<{ isSelected: boolean }>`
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

  .search-icon {
    margin-right: 8px;
  }
`

const Text = styled.div`
  padding: 12px 24px;
`
