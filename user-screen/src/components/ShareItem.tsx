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
  broadcastNo,
  savedImgPath,
  srcImg,
  linkText,
  title,
  tipText,
}: IData) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const goSite = (linkText: string) => {
    if (!linkText) return
    window.open(linkText, '_blank')
  }
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
