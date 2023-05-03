import axios from 'axios'
const instance = axios.create({
  headers: { 'Content-Type': 'application/json' }
})
export const getSearchKeyword = async (keyword: string) => {
  try {
    const response = await instance.get(
      `api/v1/search-conditions/?name=${keyword}`
    )
    console.log(`api called`)

    return response
  } catch (error) {
    throw error
  }
}
