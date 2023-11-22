import { useNavigate } from 'react-router-dom'

// components
import Button from './Button'

// types
import { IData } from '../interface/commonInterface'

// API
import { deleteItems } from '../api/shareAPI'
import { useContext } from 'react'
import { ShareDispatchContext } from '../App'

const ShareItem = ({
  shareId,
  broadcastNo,
  srcImg,
  linkText,
  title,
  tipText,
}: IData) => {
  const navigate = useNavigate()
  const { fetchData } = useContext(ShareDispatchContext)

  const goEdit = () => {
    navigate(`/edit/${shareId}`)
  }
  const goDetail = () => {
    navigate(`/detail/${shareId}`)
  }
  const onDelete = async () => {
    const params = {
      broadcastNo: broadcastNo,
      shareId: shareId,
    }

    try {
      const response = await deleteItems(params)
      if (response.status === 200) {
        fetchData(1)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return (
    <div className="ShareItem">
      <div className="img_wrapper">
        <img src="/assets/afreecatv_logo.jpg" alt="defaultImg" />
      </div>
      <div className="info_wrapper" onClick={goDetail}>
        <div className="shareTitle">{title}</div>
        <div className="description_wrapper">
          <div className="shareDescription">{tipText}</div>
        </div>
      </div>
      <div className="btn_wrapper">
        <div>
          <Button text="수정하기" onClick={goEdit} />
        </div>
        <div style={{marginTop: '5px'}}>
          <Button text="삭제하기" type="cancel" onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default ShareItem
