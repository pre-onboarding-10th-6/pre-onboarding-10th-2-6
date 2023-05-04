import { Disease } from '../types/disease'

import { instance } from '.'
const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy'
export const getDiseases = (name: string): Promise<Disease[]> =>
  instance.get(`${PROXY}api/v1/search-conditions/`, { params: { name } })
