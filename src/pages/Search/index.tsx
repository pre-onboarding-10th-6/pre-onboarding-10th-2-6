import { GrSearch } from 'react-icons/gr'
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

  const validSearchKeyword = () =>
    Array.isArray(result) &&
    result.slice(0, 6).map((item: SEARCH_ITEM, idx) => (
      <Item key={item.id} tabIndex={0} isSelected={idx === selectedIdx}>
        <SearchItem>
          <GrSearch className="search-icon" style={{ marginRight: '8px' }} />
          {item.name}
        </SearchItem>
      </Item>
    ))

  const invalidSearchKeyword = () => <Text>검색어 없음</Text>

  return (
    <Main>
      <Head>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </Head>
      <SearchWrap>
        <SearchInput>
          <Input
            id="searchInput"
            type="text"
            name="searchKeyword"
            placeholder="질환명을 입력해주세요."
            value={searchKeyword}
            onChange={handleChange}
            onKeyDown={handleKeyUpDown}
          >
            {loading ? (
              <Text>검색중...</Text>
            ) : (
              <>
                {result.length === 0
                  ? invalidSearchKeyword()
                  : validSearchKeyword()}
              </>
            )}
          </Input>
          <SearchIcon>
            <>
              <GrSearch className="search-icon" />
            </>
          </SearchIcon>
        </SearchInput>
      </SearchWrap>
    </Main>
  )
}

export default Search

const Main = styled.main`
  width: 100%;
  padding: 80px 0 160px;
  background-color: #cae9ff;
`

const Head = styled.h1`
  font-size: 2.125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 40px;
`

const SearchWrap = styled.div`
  width: 100%;
  margin: 0 auto;
`

const SearchInput = styled.div`
  display: flex;
  position: relative;
  width: 400px;
  margin: 0 auto;
`

const SearchIcon = styled.button`
  position: absolute;
  right: -10px;
  margin: 8px 0;
  padding: 6px 10px;
  background: #007be9;
  font-size: 26px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 99;

  path {
    stroke: #fff;
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
