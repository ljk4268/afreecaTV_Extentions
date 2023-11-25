import { ShareDataContext } from '../App'
import { useContext } from 'react'

// components
import ShareItem from '../components/ShareItem'
import Accordion from 'react-bootstrap/Accordion'

// types
import { IData } from '../interface/commonInterface'

const Home = () => {
  const dataList = useContext(ShareDataContext)

  const compare: (a: IData, b: IData) => number = (a, b) => {
    return b.shareId - a.shareId
  }
  dataList.sort(compare)

  return (
    <div className="Home">
      <div className="homeHeader">
        <p>💡 오늘의 공유</p>
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
