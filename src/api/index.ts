import axios, { AxiosInstance } from 'axios'

const options = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export const instance: AxiosInstance = axios.create(options)

instance.interceptors.request.use(config => {
  console.info('calling api')
  return config
})

instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error.message)
)
