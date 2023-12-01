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
  const broadNo = useContext(ShareBroadNoContext) // 방송번호
  const navigate = useNavigate() // 페이지 이동하기 위한 라우터
  const titleRef = useRef<HTMLInputElement>(null) // title 태그 
  const inputRef = useRef<HTMLInputElement>(null) // input 태그
  const linkRef = useRef<HTMLInputElement>(null) // linkInput 태그
  const imgRef = useRef<HTMLImageElement>(null) // img 태그
  const [shareTitle, setShareTitle] = useState<string>('') // 타이틀
  const [shareLink, setShareLink] = useState<string>('') // 링크
  const [shareDes, setShareDes] = useState<string>('') // 상세내용
  const [sizeLimit, setSizeLimit] = useState<boolean>(false) // 이미지사이즈
  const [invalidLink, setInvalidLink] = useState<boolean>(false) // 유효성
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null) // 이미지 URL

  useEffect(() => {
    // 수정화면인 경우 title, link, description 값 셋팅 및 이미지 가져오기
    if (isEdit) {
      if (originData) {
        setShareTitle(originData.title)
        setShareLink(originData.linkText)
        setShareDes(originData.tipText)
        fetchImages()
      }
    }
  }, [isEdit, originData])

  /**
   * 새 글 작성 또는 수정 로직
   * @returns 메인화면 이동
   */
  const handleSubmit = async () => {
    try {
      // 제목이 비어있으면 해당 칸으로 이동 및 포커스
      if (shareTitle.length < 1) {
        titleRef.current?.focus()
        return
      }

      // 링크에 'afreecatv.com'이 포함되어있지 않으면 해당 칸으로 이동 및 포커스
      if (shareLink && !shareLink.includes('afreecatv.com')) {
        setInvalidLink(true)
        linkRef.current?.focus()
        return
      }

      // 새 글 작성시 보낼 params
      const insertBroadcastShareInfo = {
        broadcastNo: broadNo,
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      // 수정시 보낼 params
      const updataeBroadcastShareInfo = {
        shareId: originData?.shareId,
        broadcastNo: broadNo,
        srcImg: originData?.srcImg,
        linkText: shareLink,
        title: shareTitle,
        tipText: shareDes,
      }

      // formData 생성
      const formData = new FormData()

      // 사진 크기 검사 후 10mb보다 작으면 multipartFiles로 파일 첨부
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

      if (isEdit) { // 수정시 서버에 보내지는 데이터
        formData.append(
          'updataeBroadcastShareInfo',
          new Blob([JSON.stringify(updataeBroadcastShareInfo)], {
            type: 'application/json',
          })
        )
        response = await editItems(formData)
      } else {
        formData.append( // 새 글 작성시 서버에 보내지는 데이터
          'insertBroadcastShareInfo',
          new Blob([JSON.stringify(insertBroadcastShareInfo)], {
            type: 'application/json',
          })
        )
        response = await addItems(formData)
      }
      // 성공시 메인화면 이동
      if (response.status === 200) {
        navigate(`/${broadNo}`, { replace: true })
      } else {
        console.error('Error:', response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  /**
   * 촬영 아이콘 클릭시 input태그 클릭되는 메소드
   */
  const handleAddImage = () => {
    document.getElementById('backgroundImgInput')?.click()
  }

  /**
   * 이미지가 추가 및 변경된 경우 imageDataUrl값 업데이트
   * @param e : 사용자가 추가한 이미지
   */
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null

    if (file) {
      let reader = new FileReader()
      reader.onload = function (event) {
        const imageData = event.target?.result as string
        setImageDataUrl(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * 서버에서 받아온 이미지를 URL로 변경하고, 
   * 변경된 URL를 imageDataUrl에 할당
   */
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

  return (
    <div className="Editor">
      {/* 이미지 */}
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
      {/* 타이틀 */}
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
      {/* 링크 */}
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
      {/* 상세내용 */}
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
      {/* 버튼 */}
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
