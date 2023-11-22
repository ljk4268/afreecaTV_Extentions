import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShareDataContext } from '../App'

// types
import { IData } from '../interface/commonInterface'

// componenst
import Editor from '../components/Editor'

const Edit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dataList = useContext(ShareDataContext)
  const [originData, setOriginData] = useState<IData>()

  useEffect(() => {
    if (dataList.length > 1) {
      if (id) {
        const postEdit = dataList.find((d) => d.shareId === parseInt(id))
        if (postEdit) {
          setOriginData(postEdit)
        } else {
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
