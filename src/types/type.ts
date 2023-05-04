export interface ResultItem {
  id: number
  name: string
}

export interface KeywordListProps {
  results: ResultItem[]
  onClick: (selectedKeyword: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => void
  selectedIndex: number
}
