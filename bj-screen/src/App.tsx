import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { createContext, useEffect, useReducer } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// components
import Home from './pages/Home'
import New from './pages/New'
import Edit from './pages/Edit'

// types
import {
  IAuthInfo,
  IBroadInfo,
  IData,
  IAction,
  IBroadIdAction,
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
const broadNoReducer = (state: number, action: IBroadIdAction) => {
  switch (action.type) {
    case 'FETCH_BROADNO':
      state = action.payload
      return state
    default:
      return state
  }
}

//context
export const ShareDataContext = createContext<IData[]>([])
export const ShareBroadNoContext = createContext<number>(0)
export const ShareDispatchContext = createContext<any>(undefined)

function App() {
  const [data, dispatch] = useReducer(reducer, []) // 공유할 정보 데이터
  const [broadNo, broadNoDispatch] = useReducer(broadNoReducer, 0) // 방송번호
  const navigate = useNavigate() // 페이지이동시 필요한 라우터

  /**
   * 방송번호로 BJ가 공유한 정보를 가져오는 함수입니다.
   * @param broadNo 
   */
  const fetchData = async (broadNo: number) => {
    if (broadNo !== 0) {
      try {
        const response = await getItems({ broadcastNo: broadNo })
        response.data.shareList.forEach((d: IData) => {
          d.tipText = d.tipText === '' ? '내용없음' : d.tipText
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data.shareList })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    const SDK = window.AFREECA.ext
    const extensionSDK = SDK()
    extensionSDK.handleInitialization(
      (authInfo: IAuthInfo, broadInfo: IBroadInfo) => {
        if (authInfo.isBJ) { // BJ가 맞는지 확인
          fetchData(broadInfo.broadNo) // 공유한 정보를 가져옴
          broadNoDispatch({ type: 'FETCH_BROADNO', payload: broadInfo.broadNo }) // 방송번호를 저장
          navigate(`/${broadInfo.broadNo}`) // 페이지 이동하기 위한 라우터
        } else {
        }
      }
    )
  }, [])

  return (
    <ShareDataContext.Provider value={data}>
      <ShareBroadNoContext.Provider value={broadNo}>
        <ShareDispatchContext.Provider value={{ fetchData }}>
          <div className="App">
            <Routes>
              {/* 메인화면 */}
              <Route path="/:broadNo" element={<Home />}></Route> 
              {/* 새 글 작성 */}
              <Route path="/new" element={<New />}></Route>
              {/* 수정화면 */}
              <Route path="/edit/:id" element={<Edit />}></Route>
            </Routes>
          </div>
        </ShareDispatchContext.Provider>
      </ShareBroadNoContext.Provider>
    </ShareDataContext.Provider>
  )
}

export default App
