import { useNavigate } from 'react-router-dom'
import {
  ShareDataContext,
  ShareBroadNoContext,
  ShareDispatchContext,
} from '../App'
import { useContext, useEffect } from 'react'

// components
import Button from '../components/Button'
import ShareItem from '../components/ShareItem'
import Accordion from 'react-bootstrap/Accordion'

// types
import { IData } from '../interface/commonInterface'

const Home = () => {
  const dataList = useContext(ShareDataContext)
  const broadNo = useContext(ShareBroadNoContext)
  const { fetchData } = useContext(ShareDispatchContext)
  const navigate = useNavigate()

  const compare: (a: IData, b: IData) => number = (a, b) => {
    return b.shareId - a.shareId
  }
  dataList.sort(compare)

  useEffect(() => {
    fetchData(broadNo)
  }, [broadNo])

  return (
    <div className="Home">
      <div className="homeHeader">
        <p>💡 오늘의 공유</p>
        <Button text="추가하기" onClick={() => navigate('/new')} />
      </div>
      {dataList.length < 1 ? (
        <div className="nodata">등록된 내용이 없습니다</div>
      ) : (
        <div className="list_wrapper">
          <Accordion>
            {dataList.map((data) => (
              <ShareItem {...data} key={data.shareId} />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
export default Home
