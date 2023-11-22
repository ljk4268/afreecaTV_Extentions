import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { createContext, useEffect, useReducer } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
// components
import Home from './pages/Home'
import New from './pages/New'
import Edit from './pages/Edit'
import Detail from './pages/Detail'

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

// initialShareData
const initialData: IData[] = []

//context
export const ShareDataContext = createContext<IData[]>(initialData)
export const ShareDispatchContext = createContext<any>(undefined)

function App() {
  const [data, dispatch] = useReducer(reducer, initialData)
  const { pathname } = useLocation()

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
    // const SDK = window.AFREECA.ext
    // const extensionSDK = SDK()
    // extensionSDK.handleInitialization(
    //   (authInfo: IAuthInfo, broadInfo: IBroadInfo) => {
    //     if (authInfo.isBJ) {
    //       fetchData(broadInfo.broadNo)
    //     }
    //   }
    // )
    console.log('App')
    fetchData(1)
  }, [])

  return (
    <ShareDataContext.Provider value={data}>
      <ShareDispatchContext.Provider value={{ fetchData }}>
        <div className="App">
          {pathname === '/index.html' ? <Home /> : ''}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/new" element={<New />}></Route>
            <Route path="/edit/:id" element={<Edit />}></Route>
            <Route path="/detail/:id" element={<Detail />} />
          </Routes>
        </div>
      </ShareDispatchContext.Provider>
    </ShareDataContext.Provider>
  )
}

export default App
