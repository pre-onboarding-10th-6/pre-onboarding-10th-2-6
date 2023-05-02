import axios from 'axios'

const defaultOptions = {
  baseURL: `${location.origin}/api/v1`
}

const instance = axios.create(defaultOptions)

export { instance }
