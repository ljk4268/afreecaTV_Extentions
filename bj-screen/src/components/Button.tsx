import { IButton } from '../interface/commonInterface'

const Button: React.FC<IButton> = ({ text, type = 'default', onClick }) => {
  // props type에 cancel이 있으면 cancel, 없으면 default 
  const btnType = ['cancel'].includes(type) ? type : 'default'

  return (
    <button
      className={['commonBtn', `commonBtn_${btnType}`].join(' ')}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
