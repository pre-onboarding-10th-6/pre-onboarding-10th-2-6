import styled from 'styled-components'

import { ReactComponent as IconSearch } from '../icons/IconSearch.svg'
import { SearchData } from '../types'

import { getRecentKeywords, setRecentKeywords } from './recentKeywords'

interface Props {
  debouncedInput: string
  cachedData: SearchData[]
  focusedItem: number
  searchItemCnt: React.MutableRefObject<HTMLUListElement | null>
}

interface ItemProps {
  children: string | React.ReactNode
  classStatement: string
}

const SearchList = ({
  debouncedInput,
  focusedItem,
  searchItemCnt,
  cachedData
}: Props) => {
  const recentKeywords = getRecentKeywords()

  const onMouseDownHandler = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const { currentTarget } = event
    const titleElement = currentTarget.childNodes[1] as HTMLElement
    const subtitleElement = currentTarget.childNodes[2] as
      | HTMLElement
      | undefined

    const title = titleElement?.textContent?.trim() ?? ''
    const subTitle = subtitleElement?.textContent?.trim() ?? ''

    const search = `${title} ${subTitle}`.trim()

    if (search.length > 0) {
      setRecentKeywords(search)
      // fetch하고 그 결과를 debouncedInput, cachedData에 반영해야함
      // setSearchState({
      //   result: await searchAndGetResult(search),
      //   input: search
      // })
    }
  }

  const SearchResultItem = ({ children, classStatement }: ItemProps) => {
    return (
      <Item className={classStatement} onMouseDown={onMouseDownHandler}>
        <IconSearch />
        <p>{children}</p>
      </Item>
    )
  }

  return (
    <List ref={searchItemCnt}>
      {debouncedInput.length === 0 ? (
        <>
          <Text>최근 검색어</Text>
          {recentKeywords?.map((keyword: string, idx: number) => (
            <SearchResultItem
              key={idx}
              classStatement={focusedItem === idx ? 'focused' : ''}
            >
              {keyword}
            </SearchResultItem>
          ))}
        </>
      ) : cachedData.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <>
          <SearchResultItem classStatement={focusedItem === 0 ? 'focused' : ''}>
            <Bold>{debouncedInput}</Bold>
          </SearchResultItem>
          <Text>추천 검색어</Text>
          {cachedData.slice(0, 7).map((arr, idx: number) => (
            <SearchResultItem
              key={arr.id}
              classStatement={focusedItem === idx + 1 ? 'focused' : ''}
            >
              <Bold>{debouncedInput}</Bold>
              {arr.name.split(debouncedInput)[1]}
            </SearchResultItem>
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
