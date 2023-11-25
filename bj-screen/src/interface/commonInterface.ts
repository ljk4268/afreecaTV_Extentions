import { BlobOptions } from 'buffer'

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

export interface IPlayerInfo {
  displayResolution: IResolution
  isFullScreen: Boolean
  isMuted: Boolean
  isScreenMode: Boolean
  isPipMode: Boolean
  isRadio: Boolean
  language: String
  theme: String
  volume: Number
}

export interface IButton {
  text: string
  type?: string
  onClick?: () => void
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

export interface IBroadIdAction {
  type: 'FETCH_BROADNO'
  payload: number
}

export interface IIsBJAction {
  type: 'FETCH_ISBJ'
  payload: Boolean
}

export interface EditorProps {
  isEdit?: boolean
  originData?: IData
}
