import { Disease } from '../types/disease'

import { instance } from '.'

export const getDiseases = (name: string): Promise<Disease[]> =>
  instance.get('api/v1/search-conditions/', { params: { name } })
