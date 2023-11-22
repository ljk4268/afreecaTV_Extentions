import { api } from './utils/instance'

//axios
export function getItems(params) {
  return api.post('/read', params)
}

export function addItems(params) {
  return api.post('/create', params)
}

export function editItems(params) {
  return api.post('/update', params)
}

export function deleteItems(params) {
  return api.post('/delete', params)
}
