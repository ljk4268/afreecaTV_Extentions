import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShareDataContext } from '../App'

// componenst
import Editor from '../components/Editor'

// types
import { IData } from '../interface/commonInterface'

const Edit = () => {
  const navigate = useNavigate() // 페이지 이동하기 위한 라우터
  const { id } = useParams() // 해당글 고유번호
  const dataList = useContext(ShareDataContext) // 공유한 정보 리스트
  const [originData, setOriginData] = useState<IData>() // 원본 데이터

  useEffect(() => {
    if (dataList.length >= 1) {
      if (id) {
        // 수정하길 원하는 데이터 찾는 로직
        const postEdit = dataList.find((d) => d.shareId === parseInt(id))
        if (postEdit) {
          // state originData 값 업데이트
          setOriginData(postEdit)
        } else {
          // 메인으로 페이지 이동
          navigate('/', { replace: true })
        }
      }
    }
  }, [id, dataList])
  return (
    <div style={{ width: '100%' }}>
      {originData && <Editor isEdit={true} originData={originData} />}
    </div>
  )
}
export default Edit
