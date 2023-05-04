import React, { ChangeEvent } from 'react'

import { Button, Form, Input, SearchBarWrapper } from './SearchBarStyle'
interface SearchBarProps {
  keyword: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onChange,
  onKeyDown
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 키워드를 검색하는 API를 호출하는 부분
    console.log('search keyword:', keyword)
  }
  return (
    <SearchBarWrapper>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="search-bar" aria-label="질환명을 검색해주세요." />
        <Input
          type="text"
          id="search-bar"
          name="search-bar"
          value={keyword}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="질환명을 입력해 주세요."
        />
        <Button type="submit">검색</Button>
      </Form>
    </SearchBarWrapper>
  )
}

export default SearchBar
