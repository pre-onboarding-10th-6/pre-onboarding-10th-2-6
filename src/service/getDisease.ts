import { instance } from '../util/axios'

const getDisease = async (str: string) => {
  const { data } = await instance.get(`search-conditions/?name=${str}`)
  return data
}

export { getDisease }
