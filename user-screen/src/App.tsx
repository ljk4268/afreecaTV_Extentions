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
  const [data, dispatch] = useReducer(reducer, [])
  const navigate = useNavigate()

  const fetchData = async (broadNo: number) => {
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

  useEffect(() => {
    const SDK = window.AFREECA.ext
    const extensionSDK = SDK()
    extensionSDK.handleInitialization(
      (broadInfo: IBroadInfo) => {
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
            <Route path="/:broadNo" element={<Home />}></Route>
          </Routes>
        </div>
      </ShareDispatchContext.Provider>
    </ShareDataContext.Provider>
  )
}

export default App
