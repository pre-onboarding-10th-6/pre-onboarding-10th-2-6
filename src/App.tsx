import styled from 'styled-components'

import Search from './Search/Search'

function App() {
  return (
    <div className="App">
      <Main>
        <Search />
      </Main>
    </div>
  )
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  margin-top: 5%;
`

export default App
