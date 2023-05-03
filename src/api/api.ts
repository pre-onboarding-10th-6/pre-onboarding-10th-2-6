import axios from 'axios'
// api/v1/search-conditions/?name={검색어}
const instance = axios.create({
  // baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const getSearchKeyword = async (keyword: string) => {
  try {
    const response = await instance.get(
      `api/v1/search-conditions/?name=${keyword}`
    )
    console.log('api called')
    return response.data
  } catch (error) {
    throw error
  }
}
