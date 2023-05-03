import axios, { AxiosInstance } from 'axios'

const BASE_URL = ''

const defaultOptions = {
  baseURL: BASE_URL
}

export const instance: AxiosInstance = axios.create(defaultOptions)
