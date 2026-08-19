import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/LoadingScreen.css'

function EngravingRequestLoadingScreen({ onDone }) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), 2000)
    return () => clearTimeout(timer)
  }, [])

  return createPortal(
    <div className="loading-screen">
      <div className="loading-screen__logo-wrap">
        <img
          src={mcmLogo}
          alt=""
          className="loading-screen__logo"
        />
        <p className="loading-screen__label">loding...</p>
      </div>

      <div className="loading-screen__tip-box">
        <p className="loading-screen__tip-title">Tip!</p>
        <p className="loading-screen__tip-text">
          마이 페이지에 들어가면
          <br />
          신청한 각인의 현황을 확인할 수 있어요.
        </p>
      </div>
    </div>,
    document.querySelector('.phone-frame') || document.body,
  )
}

export default EngravingRequestLoadingScreen