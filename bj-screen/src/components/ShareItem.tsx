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
  const navigate = useNavigate() // 페이지 이동하기 위한 라우터
  const { fetchData } = useContext(ShareDispatchContext) // 공유한 정보 가져오는 메소드
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null) // 이미지 URL

  /**
   * 수정페이지로 이동
   */
  const goEdit = () => {
    navigate(`/edit/${shareId}`)
  }
  /**
   * 선택된 내용이 삭제
   */
  const onDelete = async () => {
    const params = {
      broadcastNo: broadcastNo,
      shareId: shareId,
    }

    try {
      const response = await deleteItems(params)
      if (response.status === 200) {
        fetchData(broadcastNo)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  /**
   * 입력된 링크가 있는경우 해당 링크로 이동
   * @param linkText 
   * @returns 
   */
  const goSite = (linkText: string) => {
    if (!linkText) return
    window.open(linkText, '_blank')
  }
  /**
   * 서버에서 받아온 이미지를 URL로 변경하고, 
   * 변경된 URL를 imageDataUrl에 할당
   */
  const fetchImages = async () => {
    const params = {
      srcImg: srcImg,
      savedImgPath: savedImgPath,
    }
    try {
      const res = await getImage(params)
      if (res.status) {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: res.headers['content-type'] })
        )
        setImageDataUrl(url)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    // srcImg와 savedImgPath 값이 있는 경우 fetchImages() 실행
    if (srcImg && savedImgPath) {
      fetchImages()
    }
  }, [srcImg, savedImgPath])

  return (
    <div className="ShareItem">
      <div className="contents">
        <Accordion.Item eventKey={`${shareId}`}>
          <Accordion.Header>
            <div
              className="img_wrapper"
              onClick={(event) => {
                event.stopPropagation()
                goSite(linkText)
              }}
            >
              {imageDataUrl ? (
                <img src={imageDataUrl} alt={srcImg} />
              ) : (
                <div className="defaultIMG"></div>
              )}
            </div>
            <div className="shareTitle">{title}</div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="text_box" style={{ whiteSpace: 'pre-wrap' }}>
              {tipText}
            </div>
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
