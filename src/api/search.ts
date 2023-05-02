import { instance } from '.'

export const getSearchAPI = (search: string) =>
  instance.get(`/search-conditions/?name=${search}`, {
    headers: {
      'Cache-Control': 'max-age=86400'
    }
  })
