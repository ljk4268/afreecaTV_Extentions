import axios from 'axios'

function create(baseURL, options) {
  const instance = axios.create(Object.assign({ baseURL }, options))
  return instance
}

export const api = create(`${process.env.REACT_APP_SERVER}/v1/api`)
