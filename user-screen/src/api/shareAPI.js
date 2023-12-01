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
