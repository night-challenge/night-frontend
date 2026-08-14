import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/LoadingScreen.css'

// 하단 탭 이동 시 2초간 랜덤으로 뜨는 로딩 화면 (로딩중4/5/6)
const TIPS = [
  '마이페이지에 들어가시면\n그동안 모은 카드를 확인 할 수 있어요.',
  '한번 만든 각인은 수정이 불가능하지만\n여러번 게임을 하면 의도치 않은 새로운 각인을 만들 수 있어요!',
  '각인 페이지에 들어가면\n각인 이름을 자유롭게 수정할 수 있답니다!',
]

function LoadingScreen({ onDone }) {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])
  // onDone이 매 렌더마다 새로 만들어져도 타이머가 리셋되지 않게 ref로 고정
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), 2000)
    return () => clearTimeout(timer)
  }, [])

  return createPortal(
    <div className="loading-screen">
      <div className="loading-screen__logo-wrap">
        <img src={mcmLogo} alt="" className="loading-screen__logo" />
        <p className="loading-screen__label">loding...</p>
      </div>
      <div className="loading-screen__tip-box">
        <p className="loading-screen__tip-title">Tip!</p>
        <p className="loading-screen__tip-text">{tip}</p>
      </div>
    </div>,
    document.querySelector('.phone-frame') || document.body,
  )
}

export default LoadingScreen
