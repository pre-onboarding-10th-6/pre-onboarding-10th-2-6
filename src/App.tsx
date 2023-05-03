import React from 'react'

import SearchBar from './components/search/SearchBar'

function App() {
  return (
    <div className="App">
      <SearchBar
        onSearch={(query: string): void => {
          throw new Error('Function not implemented.')
        }}
      />
    </div>
  )
}

export default App
