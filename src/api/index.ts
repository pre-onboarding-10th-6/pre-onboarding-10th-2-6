import axios, { AxiosInstance, AxiosResponse } from 'axios'

import { SEARCH_ITEM } from '../types'

const BASE_URL = '/api/v1/search-conditions'

const defaultOptions = {
  baseURL: BASE_URL
}
const instance: AxiosInstance = axios.create(defaultOptions)

export const searchAPI = (
  debouncedValue: string
): Promise<AxiosResponse<SEARCH_ITEM[]>> =>
  instance.get(`/?name=${debouncedValue}`, {
    headers: {
      //TODO
      'Cache-Control': 'max-age=300'
    }
  })
