import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'
import { RECENT_KEYWORDS, SearchData } from '../../types'

interface Props {
  searchResult: SearchData[]
  searchInput: string
  focusedItem: number
  searchItemCnt: React.MutableRefObject<HTMLUListElement | null>
}

const SearchList = ({
  searchResult,
  searchInput,
  focusedItem,
  searchItemCnt
}: Props) => {
  const recentKeywords = JSON.parse(
    sessionStorage.getItem(RECENT_KEYWORDS) as string
  )

  const RecentKeyword = () => {
    return (
      <>
        <p>최근 검색어</p>
        {recentKeywords.map((keyword: string, idx: number) => (
          <Item key={idx} className={focusedItem === idx ? 'focused' : ''}>
            <IconSearch />
            {keyword}
          </Item>
        ))}
      </>
    )
  }

  const SearchResult = () => {
    return searchResult.length === 0 ? (
      <p>검색 결과가 없습니다.</p>
    ) : (
      <>
        <Item className={focusedItem === 0 ? 'focused' : ''}>
          <IconSearch />
          {searchInput}
        </Item>
        <p>추천 검색어</p>
        {searchResult.splice(0, 7).map((arr, idx: number) => (
          <Item
            key={arr.id}
            className={focusedItem === idx + 1 ? 'focused' : ''}
          >
            <IconSearch />
            {arr.name}
          </Item>
        ))}
      </>
    )
  }

  return (
    <List>
      {searchInput.length === 0 ? <RecentKeyword /> : <SearchResult />}
    </List>
  )
}

export default SearchList

const List = styled.ul`
  border: 1px solid rgb(194, 200, 206);
  border-radius: 20px;
  padding: 24px;
  padding-bottom: 16px;
  box-shadow: rgba(30, 32, 37, 0.1) 0px 2px 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Item = styled.li`
  list-style: none;
  cursor: pointer;
  &.focused {
    background: rgb(248, 249, 250);
  }
  &:hover {
    background: rgb(248, 249, 250);
  }
`
