import { api } from './utils/instance'

//axios

// 공유된 정보 가져오는 메소드
export function getItems(params) {
  return api.post('/read', params)
}
// 이미지 가져오는 메소드
export function getImage(params) {
  return api.post('/image', params, { responseType: 'blob' })
}
// 정보 추가하는 메소드
export function addItems(params) {
  return api.post('/create', params, { 'Content-Type': 'multipart/form-data' })
}
// 정보 수정하는 메소드
export function editItems(params) {
  return api.post('/update', params, { 'Content-Type': 'multipart/form-data' })
}
// 정보 삭제하는 메소드
export function deleteItems(params) {
  return api.post('/delete', params)
}
