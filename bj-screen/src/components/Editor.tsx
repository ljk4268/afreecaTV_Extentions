import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShareDataContext } from '../App'
import { addItems, editItems } from '../api/shareAPI'

// components
import Button from './Button'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

// types
import { IData } from '../interface/commonInterface'

interface EditorProps {
  isEdit?: boolean
  originData?: IData
}

const Editor: React.FC<EditorProps> = ({ isEdit, originData }) => {
  const dataList = useContext(ShareDataContext)
  const broadcastNo = 1
  const navigate = useNavigate()
  const titleRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [shareTitle, setShareTitle] = useState<string>('')
  const [shareLink, setShareLink] = useState<string>('')
  const [shareDes, setShareDes] = useState<string>('')

  useEffect(() => {
    if (isEdit) {
      if (originData) {
        setShareTitle(originData.title)
        setShareLink(originData.linkText)
        setShareDes(originData.tipText)
      } // content == "" ? "내용없음" : content
    }
  }, [isEdit, originData])

  const handleSubmit = async () => {
    try {
      if (shareTitle.length < 1) {
        titleRef.current?.focus()
        return
      }

      const broadcastShareInsertDTO = {
        broadcastNo: broadcastNo,
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      const broadcastShareUpdateDTO = {
        shareId: originData?.shareId,
        broadcastNo: broadcastNo,
        srcImg: '',
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      const formData = new FormData()

      const fileInput = inputRef.current
      if (fileInput && fileInput.files) {
        const file = fileInput.files[0]
        formData.append('multipartFiles', file)
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
        navigate('/', { replace: true })
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
        // 이미지의 경로를 변경
        if (imgRef.current) {
          imgRef.current.src = event.target?.result as string
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="Editor">
      <section>
        <div className="img_wrapper">
          <img ref={imgRef} src="/assets/afreecatv_logo.jpg" alt="defaultImg" />
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
            placeholder="공유하고 싶은 정보를 입력해주세요."
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
            value={shareLink}
            className="input_link"
            type="text"
            placeholder="링크가 있다면 입력해주세요."
            onChange={(e) => setShareLink(e.target.value)}
          ></input>
        </div>
      </section>
      <section>
        <div className="sectionTitle">
          <p>내용</p>
        </div>
        <div className="input_box">
          <textarea
            value={shareDes}
            placeholder="추가적인 내용이 필요하다면 입력해주세요."
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
