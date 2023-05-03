export const RECENT_KEYWORDS = 'recentKeywords'

export interface SearchData {
  name: string
  id: number
}

export interface SearchState {
  input: string
  result: SearchData[]
}
