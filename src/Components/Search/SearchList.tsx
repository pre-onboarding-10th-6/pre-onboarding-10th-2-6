import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../../icons/IconSearch.svg'
import { RECENT_KEYWORDS, SearchData } from '../../types'

interface Props {
  searchResult: SearchData[]
  searchInput: string
}

const SearchList = ({ searchResult, searchInput }: Props) => {
  const recentKeywords = JSON.parse(
    sessionStorage.getItem(RECENT_KEYWORDS) as string
  )

  const RecentKeyword = () => {
    return (
      <>
        <p>최근 검색어</p>
        {recentKeywords.map((keyword: string, idx: number) => (
          <Item key={idx}>
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
        <p>추천 검색어</p>
        {searchResult.map(arr => (
          <Item key={arr.id}>{arr.name}</Item>
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
`
