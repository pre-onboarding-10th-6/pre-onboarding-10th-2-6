import styled from 'styled-components'

import SearchInput from './components/SearchInput'
import SearchResult from './components/SearchResult'
import GlobalStyle from './styles/GlobalStyle'
import { backgroundBlue } from './styles/mixins'

const PageWrapper = styled.div`
  ${backgroundBlue}
  width: 100%;
  height: 100vh;
`

const SearchSectionWrapper = styled.div`
  width: 480px;
  margin: 0 auto;
  padding-top: 100px;
`

function App() {
  return (
    <PageWrapper>
      <GlobalStyle />
      <SearchSectionWrapper>
        <SearchInput />
        <SearchResult />
      </SearchSectionWrapper>
    </PageWrapper>
  )
}

export default App
