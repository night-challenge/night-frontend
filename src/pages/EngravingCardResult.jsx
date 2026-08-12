import { useNavigate } from 'react-router-dom'
import { mockEngravings } from '../data/engravingData'
import ConstellationThumb from '../components/ConstellationThumb.jsx'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
import '../styles/EngravingCardResult.css'

function EngravingCardResult() {
  const navigate = useNavigate()

  // TODO: 실제 저장한 각인을 route state로 받아 연결. 지금은 mock 첫 번째.
  const engraving = mockEngravings[0]
  const afterData = engraving.constellationData.after
  const name = engraving.constellationName

  return (
    <div className="cardresult">
      <div className="cardresult__congrats">
        <p>축하합니다.</p>
        <p>나만의 별자리를 만들어 카드를 획득하셨어요!</p>
      </div>

      {/* 카드: card_image(맨아래) → 별자리 → card_text → 이름 순으로 쌓임 */}
      <div className="cardresult__card">
        <img src={cardImage} alt="" className="cardresult__card-image" />
        <div className="cardresult__card-constellation">
          <ConstellationThumb data={afterData} size={200} />
        </div>
        <img src={cardText} alt="" className="cardresult__card-text" />
        <span className="cardresult__card-name">{name}</span>
      </div>

      <div className="cardresult__buttons">
        <button className="cardresult__btn" onClick={() => navigate('/engraving')}>
          카드 보러가기
        </button>
        <button className="cardresult__btn" onClick={() => navigate('/products')}>
          제품 고르기
        </button>
      </div>

      <p className="cardresult__help">이제 내가 만든 각인을 제품에 새길 수 있어요.</p>
    </div>
  )
}

export default EngravingCardResult
