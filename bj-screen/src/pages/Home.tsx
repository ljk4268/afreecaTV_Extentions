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
  const dataList = useContext(ShareDataContext) // 공유한 정보 리스트
  const broadNo = useContext(ShareBroadNoContext) // 방송번호
  const { fetchData } = useContext(ShareDispatchContext) // 공유한 정보 가져오는 메소드
  const navigate = useNavigate() // 페이지 이동하기 위한 라우터

  
  // 최신순 정렬(=내림차순)
  dataList.sort((a: IData, b: IData) => {
    return b.shareId - a.shareId
  })

  useEffect(() => {
    // 방송번호에 해당하는 공유된 정보 가져오는 메소드 실행
    fetchData(broadNo)
  }, [])

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
