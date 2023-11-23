import { api } from './utils/instance'

//axios
export function getItems(params) {
  return api.post('/read', params)
}
export function getImage(params) {
  return api.post('/image', params, { responseType: 'blob' })
}

export function addItems(params) {
  return api.post('/create', params, { 'Content-Type': 'multipart/form-data' })
}

export function editItems(params) {
  return api.post('/update', params, { 'Content-Type': 'multipart/form-data' })
}

export function deleteItems(params) {
  return api.post('/delete', params)
}
