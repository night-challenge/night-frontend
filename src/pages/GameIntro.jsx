import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import bannerImg1 from '../assets/night_challenge_banner.svg'
import bannerImg2 from '../assets/night_challenge_banner_2.svg'
import bannerImg3 from '../assets/night_challenge_banner_3.svg'

function GameIntro() {
  const navigate = useNavigate()

  const banners = [bannerImg1, bannerImg2, bannerImg3]
  const [currentBanner, setCurrentBanner] = useState(0)

  const handlePrev = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentBanner((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="game-intro">
      <div className="game-intro-banner">

        {/* 왼쪽 화살표 */}
        <button
          className="banner-arrow banner-arrow-left"
          onClick={handlePrev}
        >
          〈
        </button>

        <img
          src={banners[currentBanner]}
          alt={`Night Challenge 2026 ${currentBanner + 1}`}
          className="banner-image"
        />

        <button
          className="banner-arrow banner-arrow-right"
          onClick={handleNext}
        >
          〉
        </button>

      </div>

      <h2 className="game-intro-title">나이트 챌린지</h2>

      <p className="game-intro-desc">
        MCM 2026 설 캠페인 '말의 해'를 맞아
        <br />
        말의 역동성과 체스 게임의 정교한 규율을 결합한
        <br />
        전략적 미학의 컬렉션을 선보였습니다.
      </p>

      <p className="game-intro-desc">
        이를 기념해 준비한 나이트 챌린지!
        <br />
        체스 나이트처럼 나만의 궤적을 그리면,
        <br />
        그게 곧 하나의 각인이 됩니다.
      </p>

      <p className="game-intro-desc">
        플레이 결과에 따라 각인의 희귀도가 달라지니
        <br />
        지금 도전해보세요!
      </p>

      <h3 className="game-intro-section-title">챌린지 보상</h3>

      <div className="reward-card">
        <h4 className="reward-card-title">각인 생성</h4>
        <p className="reward-card-desc">
          <br />
          클리어 후 AI가 나이트의 이동 패턴을 분석해
          <br />
          완성된 각인을 MCM 제품에 각인 신청할 수 있습니다.
          <br />
          세상에 하나뿐인 각인 이미지를 만들어 드립니다.
        </p>
      </div>

      <div className="reward-card">
        <h4 className="reward-card-title">승리 조건</h4>
        <p className="reward-card-desc">
          <br />
          턴 내에 지정된 목표 점수를 달성하면 챌린지 클리어.
          <br />
          결과에 따라 희귀도가 달라집니다.
        </p>
      </div>

      <button
        className="game-cta-button"
        onClick={() => navigate('/game/home')}
      >
        대전 시작하기
      </button>
    </div>
  )
}

export default GameIntro