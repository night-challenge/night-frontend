import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/LoadingScreen.css'

function formatKeywords(keywords) {
  if (!keywords) return ''

  if (Array.isArray(keywords)) {
    return keywords.join(', ')
  }

  return keywords
}

function GameResultLoadingScreen({ onDone, engraving }) {
  const [stage, setStage] = useState(1)

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(2)
    }, 1500)

    const t2 = setTimeout(() => {
      onDone?.()
    }, 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return createPortal(
    <div className="loading-screen">
      <div className="loading-screen__logo-wrap">
        <img
          src={mcmLogo}
          alt=""
          className="loading-screen__logo"
        />

        <p className="loading-screen__label">
          loading...
        </p>
      </div>

      <div className="loading-screen__tip-box">
        <p className="loading-screen__tip-title">
          Tip!
        </p>

        {stage === 1 ? (
          <section className="loading-screen__tip-text">
            <p className="naming__story-heading">
              당신의 플레이 스토리는
            </p>

            <p className="naming__story-keywords">
              {formatKeywords(engraving?.keywords)}
            </p>

            <p className="naming__story-comment">
              {engraving?.comment}
            </p>
          </section>
        ) : (
          <section className="loading-screen__tip-text">
            <p className="naming__story-heading">
              이러한 플레이를 바탕으로
              <br />
              당신만의 별자리를 생성하고 있습니다.
            </p>
          </section>
        )}
      </div>
    </div>,
    document.querySelector('.phone-frame') || document.body,
  )
}

export default GameResultLoadingScreen