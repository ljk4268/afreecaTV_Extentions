import { api } from './utils/instance'

//axios
export function getItems(params) {
  return api.post('/read', params)
}
export function getImage(params) {
  return api.post('/image', params, { responseType: 'blob' })
}
