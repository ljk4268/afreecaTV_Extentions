import { api } from './utils/instance'

//axios
export function getItems(params) {
  return api.post('/read', params)
}

export function addItems(params) {
  console.log(params.get('broadcastShareInsertDTO'))
  return api.post('/create', params, {'Content-Type': 'multipart/form-data'})
}

export function editItems(params) {
  return api.post('/update', params, {'Content-Type': 'multipart/form-data'})
}

export function deleteItems(params) {
  return api.post('/delete', params)
}
