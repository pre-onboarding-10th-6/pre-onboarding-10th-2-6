import { Suggestion } from '../types/search'

import { instance } from '.'

export const getSuggestions = (name: string): Promise<Suggestion[]> =>
  instance.get('api/v1/search-conditions/', { params: { name } })
