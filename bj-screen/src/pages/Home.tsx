import { useNavigate } from 'react-router-dom'
import { ShareDataContext, ShareDispatchContext } from '../App'
import { useContext, useEffect } from 'react'

// components
import Button from '../components/Button'
import ShareItem from '../components/ShareItem'
import { isDataView } from 'util/types'

// types
import { IData } from '../interface/commonInterface'

const Home = () => {
  const dataList = useContext(ShareDataContext)
  const { fetchData } = useContext(ShareDispatchContext)
  const navigate = useNavigate()

  const compare: (a: IData, b: IData) => number = (a, b) => {
    return b.shareId - a.shareId
  }
  dataList.sort(compare)

  useEffect(() => {
    fetchData(1)
  }, [])


  return (
    <div className="Home">
      <div className="homeHeader">
        <p>💡 오늘의 공유</p>
        <Button text="추가하기" onClick={() => navigate('/new')} />
      </div>
      <div className="list_wrapper">
        {dataList.map((data) => (
          <ShareItem {...data} key={data.shareId} />
        ))}
      </div>
    </div>
  )
}
export default Home
