import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// const BASE_URL = 'https://api.clinicaltrialskorea.com/api/v1/'
const BASE_URL = '/api/v1/'

const defaultOptions = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const instance: AxiosInstance = axios.create(defaultOptions)

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.error(error)
    return Promise.reject()
  }
)
