import { useNavigate } from 'react-router-dom'

// components
import Button from './Button'
import Accordion from 'react-bootstrap/Accordion'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'

// types
import { IData } from '../interface/commonInterface'

// API
import { deleteItems } from '../api/shareAPI'
import { useContext } from 'react'
import { ShareDispatchContext } from '../App'

const ShareItem = ({
  shareId,
  broadcastNo,
  savedImgPath,
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
  const onDelete = async () => {
    if (window.confirm('삭제 하시겠습니까?')) {
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
  }
  return (
    <div className="ShareItem">
      <div className="contents">
        <Accordion.Item eventKey={`${shareId}`}>
          <Accordion.Header>
            <div className="img_wrapper">
              <img src="/assets/afreecatv_logo.jpg" alt="defaultImg" />
            </div>
            <div className="shareTitle">{title}</div>
          </Accordion.Header>
          <Accordion.Body>
            <div style={{ whiteSpace: 'pre-wrap' }}>{tipText}</div>
            <div className="btn_wrapper">
              <div className="icon edit">
                <EditNoteOutlinedIcon onClick={goEdit} />
              </div>
              <div className="icon delete">
                <DeleteForeverOutlinedIcon onClick={onDelete} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </div>
    </div>
  )
}

export default ShareItem
