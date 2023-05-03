import axios from 'axios'

const BASE_URL = 'api/v1/'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

export const getSearchConditions = (name: string) => {
  if (name === '') throw new Error('name is empty')
  console.info('calling api')
  return axiosInstance.get<Condition[]>(`search-conditions/?name=${name}`)
}

export default {}

