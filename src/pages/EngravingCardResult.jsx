import { useNavigate } from 'react-router-dom'
import { mockEngravings } from '../data/engravingData'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
import '../styles/EngravingCardResult.css'

function EngravingCardResult() {
  const navigate = useNavigate()

  // TODO: 실제 저장한 각인을 route state로 받아 연결. 지금은 mock 데이터로 미리보기.
  const engraving = mockEngravings[1]
  const afterData = engraving.constellationData.after
  const name = engraving.constellationName

  // 별자리 좌표에 딱 맞는 viewBox(여백 최소) → 정해진 영역에 꽉 차게, 넘치지 않게
  const pts = afterData.points
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const pad = 8 // 점/선이 잘리지 않도록 여유
  const vbMinX = Math.min(...xs) - pad
  const vbMinY = Math.min(...ys) - pad
  const vbW = Math.max(...xs) + pad - vbMinX
  const vbH = Math.max(...ys) + pad - vbMinY
  const pointMap = Object.fromEntries(pts.map((p) => [p.id, p]))

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
          <svg
            className="cardresult__constellation-svg"
            viewBox={`${vbMinX} ${vbMinY} ${vbW} ${vbH}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {afterData.connections.map(([a, b], i) => {
              const p1 = pointMap[a]
              const p2 = pointMap[b]
              if (!p1 || !p2) return null
              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )
            })}
            {pts.map((p) => (
              <circle key={p.id} cx={p.x} cy={p.y} r="3" fill="currentColor" />
            ))}
          </svg>
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
