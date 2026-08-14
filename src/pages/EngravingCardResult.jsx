import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
import '../styles/EngravingCardResult.css'

function EngravingCardResult() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | success | error
  const [engraving, setEngraving] = useState(null)

  // 방금 저장한 각인 상세 조회: GET /api/engravings/{id}
  // (5.4 화면 자체의 전용 API는 명세서에 없어 상세 조회 API를 재사용)
  useEffect(() => {
    const fetchDetail = async () => {
      setStatus('loading')
      try {
        let data
        if (USE_MOCK) {
          data = mockEngravings.find((e) => String(e.id) === String(id))
          if (!data) throw new Error('not found')
        } else {
          const res = await axios.get(`/api/engravings/${id}`)
          data = res.data?.data
        }
        setEngraving(data)
        setStatus('success')
      } catch (err) {
        console.error('각인 상세 조회 실패:', err)
        setStatus('error')
      }
    }
    fetchDetail()
  }, [id])

  if (status === 'loading') {
    return (
      <div className="cardresult">
        <p className="cardresult__state">불러오는 중...</p>
      </div>
    )
  }
  if (status === 'error' || !engraving) {
    return (
      <div className="cardresult">
        <p className="cardresult__state">각인을 불러오지 못했어요.</p>
      </div>
    )
  }

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
