export interface IAuthInfo {
  accessToken: String
  userAgreeToken: String
  obscureUserId: String | null
  isBJ: Boolean
}

export interface IResolution {
  width: Number
  height: Number
}

export interface IBroadInfo {
  broadNo: number
  title: String
  thumbnail: String
  startTime: String
  allowsAdult: Boolean
  resolution: IResolution
  canResend: Boolean
  hasPassword: Boolean
  bjId: String
  bjNickname: String
  bjThumbnail: String
  categoryNo: String
  bitrate: String
}

export interface IData {
  shareId: number
  broadcastNo: number
  srcImg: string
  savedImgPath: string
  linkText: string
  title: string
  tipText: string
}

export interface IAction {
  type: 'FETCH_SUCCESS'
  payload: IData[]
}