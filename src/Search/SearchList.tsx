import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../icons/IconSearch.svg'
import { SearchData } from '../types'
import { getRecentKeywords } from '../utils/recentKeywords'

interface Props {
  searchInput: string
  cachedData: SearchData[]
  focusIndex: number
  searchItemCnt: React.MutableRefObject<HTMLUListElement | null>
  onMouseDownHandler: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => Promise<void>
}

interface ItemProps {
  children: string | React.ReactNode
  classStatement: string
}

const SearchList = ({
  searchInput,
  focusIndex,
  searchItemCnt,
  cachedData,
  onMouseDownHandler
}: Props) => {
  const recentKeywords = getRecentKeywords()

  const SearchListItem = ({ children, classStatement }: ItemProps) => {
    return (
      <Item className={classStatement} onMouseDown={onMouseDownHandler}>
        <IconSearch />
        <p>{children}</p>
      </Item>
    )
  }

  return (
    <List ref={searchItemCnt}>
      {searchInput?.length === 0 ? (
        <>
          <Text>최근 검색어</Text>
          {recentKeywords?.map((keyword: string, idx: number) => (
            <SearchListItem
              key={idx}
              classStatement={focusIndex === idx ? 'focused' : ''}
            >
              {keyword}
            </SearchListItem>
          ))}
        </>
      ) : cachedData.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <>
          <SearchListItem classStatement={focusIndex === 0 ? 'focused' : ''}>
            <Bold>{searchInput}</Bold>
          </SearchListItem>
          <Text>추천 검색어</Text>
          {cachedData.slice(0, 7).map((arr, idx: number) => (
            <SearchListItem
              key={arr.id}
              classStatement={focusIndex === idx + 1 ? 'focused' : ''}
            >
              <Bold>{searchInput}</Bold>
              {arr.name.split(searchInput)[1]}
            </SearchListItem>
          ))}
        </>
      )}
    </List>
  )
}

export default SearchList

const List = styled.ul`
  border: 1px solid rgb(194, 200, 206);
  border-radius: 20px;
  padding: 12px;
  padding-bottom: 16px;
  box-shadow: rgba(30, 32, 37, 0.1) 0px 2px 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px 16px;
`

const Item = styled.li`
  list-style: none;
  cursor: pointer;
  display: flex;
  gap: 4px;
  padding: 8px;
  p {
    margin: 0;
  }
  &.focused {
    background: rgb(248, 249, 250);
  }
  &:hover {
    background: rgb(248, 249, 250);
  }
`

const Bold = styled.span`
  font-weight: 700;
`

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  color: gray;
`
