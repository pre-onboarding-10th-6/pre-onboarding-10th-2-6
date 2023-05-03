import React, { ChangeEvent } from 'react'

interface SearchbarProps {
  keyword: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Searchbar: React.FC<SearchbarProps> = ({ keyword, onChange }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('search keyword:', keyword)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search-bar">검색어 입력:</label>
      <input
        type="text"
        id="search-bar"
        name="search-bar"
        value={keyword}
        onChange={onChange}
      />
      <button type="submit">검색</button>
    </form>
  )
}

export default React.memo(Searchbar)
