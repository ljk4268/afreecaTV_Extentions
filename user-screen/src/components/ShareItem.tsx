import { useEffect, useState } from 'react'

// components
import Accordion from 'react-bootstrap/Accordion'

// types
import { IData } from '../interface/commonInterface'

// API
import { getImage } from '../api/shareAPI'
import { ClassNames } from '@emotion/react'

const ShareItem = ({
  shareId,
  savedImgPath,
  srcImg,
  linkText,
  title,
  tipText,
}: IData) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null) // 이미지URL

  // 링크가 입력되어 있는 경우 해당 사이트로 이동
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
  }, [])

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
            <div style={{ whiteSpace: 'pre-wrap' }} className="text_box">
              {tipText}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </div>
    </div>
  )
}

export default ShareItem
