import { useNavigate } from 'react-router-dom'

// components
import Accordion from 'react-bootstrap/Accordion'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'

// types
import { IData } from '../interface/commonInterface'

// API
import { deleteItems, getImage } from '../api/shareAPI'
import { useContext, useEffect, useState } from 'react'
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
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(
    srcImg && savedImgPath ? null : '/assets/afreecatv_logo.jpg'
  )

  const goEdit = () => {
    navigate(`/edit/${shareId}`)
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
  const fetchImages = async () => {
    const params = {
      srcImg: srcImg,
      savedImgPath: savedImgPath,
    }
    try {
      const res = await getImage(params)
      if(res.status){
        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] } ));
        setImageDataUrl(url)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (srcImg && savedImgPath) {
      fetchImages()
    }
  }, [])

  return (
    <div className="ShareItem">
      <div className="contents">
        <Accordion.Item eventKey={`${shareId}`}>
          <Accordion.Header>
            <div className="img_wrapper">
              {imageDataUrl && <img src={imageDataUrl} alt="Uploaded Image" />}
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
