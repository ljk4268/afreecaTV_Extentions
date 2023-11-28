import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShareBroadNoContext } from '../App'
import { addItems, editItems } from '../api/shareAPI'

// components
import Button from './Button'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

// types
import { EditorProps } from '../interface/commonInterface'

// API
import { getImage } from '../api/shareAPI'

const Editor: React.FC<EditorProps> = ({ isEdit, originData }) => {
  const broadNo = useContext(ShareBroadNoContext)
  const navigate = useNavigate()
  const titleRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [shareTitle, setShareTitle] = useState<string>('')
  const [shareLink, setShareLink] = useState<string>('')
  const [shareDes, setShareDes] = useState<string>('')
  const [sizeLimit, setSizeLimit] = useState<boolean>(false)
  const [invalidLink, setInvalidLink] = useState<boolean>(false)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit) {
      if (originData) {
        setShareTitle(originData.title)
        setShareLink(originData.linkText)
        setShareDes(originData.tipText)
        fetchImages()
      }
    }
  }, [isEdit, originData])

  const handleSubmit = async () => {
    try {
      if (shareTitle.length < 1) {
        titleRef.current?.focus()
        return
      }

      if (shareLink && !shareLink.includes('afreecatv.com')) {
        setInvalidLink(true)
        linkRef.current?.focus()
        return
      }

      const broadcastShareInsertDTO = {
        broadcastNo: broadNo,
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      const broadcastShareUpdateDTO = {
        shareId: originData?.shareId,
        broadcastNo: broadNo,
        srcImg: originData?.srcImg,
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      const formData = new FormData()

      const fileInput = inputRef.current
      if (fileInput && fileInput.files) {
        const file = fileInput.files[0]
        const fileSize = fileInput.files[0]?.size
        const maxSize = 10 * 1024 * 1024

        if (fileSize > maxSize) {
          setSizeLimit(true)
          return
        } else {
          setSizeLimit(false)
          formData.append('multipartFiles', file)
        }
      }

      let response

      if (isEdit) {
        formData.append(
          'broadcastShareUpdateDTO',
          new Blob([JSON.stringify(broadcastShareUpdateDTO)], {
            type: 'application/json',
          })
        )
        response = await editItems(formData)
      } else {
        formData.append(
          'broadcastShareInsertDTO',
          new Blob([JSON.stringify(broadcastShareInsertDTO)], {
            type: 'application/json',
          })
        )
        response = await addItems(formData)
      }
      if (response.status === 200) {
        navigate(`/${broadNo}`, { replace: true })
      } else {
        console.error('Error:', response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAddImage = () => {
    document.getElementById('backgroundImgInput')?.click()
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null

    if (file) {
      let reader = new FileReader()
      reader.onload = function (event) {
        const imageDataUrl = event.target?.result as string
        // 이미지의 경로를 변경
        setImageDataUrl(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchImages = async () => {
    const params = {
      srcImg: originData?.srcImg,
      savedImgPath: originData?.savedImgPath,
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
    console.log('ggggg')
  }, [imageDataUrl])

  return (
    <div className="Editor">
      <section>
        <div className="img_wrapper">
          {imageDataUrl ? (
            <img ref={imgRef} src={imageDataUrl} alt={originData?.srcImg} />
          ) : (
            <div className="defaultIMG"></div>
          )}
          <AddAPhotoIcon className="img_addBtn" onClick={handleAddImage} />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            id="backgroundImgInput"
            className="addInput"
            onChange={handleChangeImage}
          />
        </div>
        {sizeLimit ? (
          <div className="errMSG">* 이미지 파일은 10mb이하만 등록됩니다.</div>
        ) : (
          ''
        )}
      </section>
      <section>
        <div className="sectionTitle">
          <p>제목</p>
        </div>
        <div className="input_box">
          <input
            ref={titleRef}
            value={shareTitle}
            className="input_title"
            type="text"
            placeholder="공유하고 싶은 정보를 입력해주세요.(필수입력)"
            onChange={(e) => setShareTitle(e.target.value)}
          ></input>
        </div>
      </section>
      <section>
        <div className="sectionTitle">
          <p>링크</p>
        </div>
        <div className="input_box">
          <input
            ref={linkRef}
            value={shareLink}
            className="input_link"
            type="text"
            placeholder="afreecatv.com이 포함된 링크를 입력해주세요.(필수입력아님)"
            onChange={(e) => setShareLink(e.target.value)}
          ></input>
        </div>
        {invalidLink ? (
          <div className="errMSG">* afreecatv.com이 포함된 링크를 입력해주세요.</div>
        ) : (
          ''
        )}
      </section>
      <section>
        <div className="sectionTitle">
          <p>내용</p>
        </div>
        <div className="input_box">
          <textarea
            value={shareDes}
            placeholder="추가적인 내용이 필요하다면 입력해주세요.(필수입력아님)"
            onChange={(e) => setShareDes(e.target.value)}
          ></textarea>
        </div>
      </section>
      <section>
        <div className="editorpage_btn">
          <Button
            text="취소"
            type="cancel"
            onClick={() => navigate(-1)}
          ></Button>
          <Button
            text={isEdit ? '수정' : '등록'}
            onClick={handleSubmit}
          ></Button>
        </div>
      </section>
    </div>
  )
}
export default Editor
