import { RECENT_KEYWORDS } from '../types'

export const setRecentKeywords = (search: string) => {
  if (sessionStorage.getItem(RECENT_KEYWORDS) !== null) {
    const arr = JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)
    sessionStorage.setItem(
      RECENT_KEYWORDS,
      JSON.stringify([search, ...arr.splice(0, 6)])
    )
  } else {
    sessionStorage.setItem(RECENT_KEYWORDS, JSON.stringify([search]))
  }
}

export const getRecentKeywords = () => {
  return JSON.parse(sessionStorage.getItem(RECENT_KEYWORDS) as string)
}
