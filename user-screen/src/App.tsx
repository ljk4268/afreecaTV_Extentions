import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { createContext, useEffect, useReducer } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// components
import Home from './pages/Home'

// types
import {
  IAuthInfo,
  IBroadInfo,
  IData,
  IAction,
} from './interface/commonInterface'
import { getItems } from './api/shareAPI'

//reducer
const reducer = (state: IData[], action: IAction) => {
  let newState: IData[] = []
  switch (action.type) {
    case 'FETCH_SUCCESS':
      newState = [...action.payload]
      break
    default:
      return state
  }
  return newState
}

//context
export const ShareDataContext = createContext<IData[]>([])
export const ShareBroadNoContext = createContext<number>(0)
export const ShareDispatchContext = createContext<any>(undefined)

function App() {
  const [data, dispatch] = useReducer(reducer, []) // 공유된 정보 리스트
  const navigate = useNavigate() // 페이지 이동을 위한 라우터

  /**
   * 방송정보에 해당하는 공유된 리스트 가져오는 메소드
   * @param broadNo 
   */
  const fetchData = async (broadNo: number) => {
    try {
      const response = await getItems({ broadcastNo: broadNo })
      // tipText가 공백이면 '내용없음'으로 변경
      response.data.shareList.forEach((d: IData) => {
        d.tipText = d.tipText === '' ? '내용없음' : d.tipText
      })
      // 서버에서 가져온 데이터로 공유된 정보 리스트 업데이트
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data.shareList })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // 처음 한 번 방송번호에 해당되는 공유된 정보 가지고 온 뒤 메인화면으로 이동
  useEffect(() => {
    const SDK = window.AFREECA.ext
    const extensionSDK = SDK()
    extensionSDK.handleInitialization(
      (authInfo: IAuthInfo, broadInfo: IBroadInfo) => {
        if (broadInfo) {
          fetchData(broadInfo.broadNo)
          navigate(`/${broadInfo.broadNo}`)
        }
      }
    )
  }, [])

  return (
    <ShareDataContext.Provider value={data}>
      <ShareDispatchContext.Provider value={{ fetchData }}>
        <div className="App">
          <Routes>
          {/* 메인화면 */}
            <Route path="/:broadNo" element={<Home />}></Route>
          </Routes>
        </div>
      </ShareDispatchContext.Provider>
    </ShareDataContext.Provider>
  )
}

export default App
