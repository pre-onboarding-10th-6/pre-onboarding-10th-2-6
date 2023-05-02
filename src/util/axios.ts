import axios from 'axios'

const defaultOptions = {
  baseURL: process.env.REACT_APP_BASE_URL
}

const instance = axios.create(defaultOptions)

export { instance }
