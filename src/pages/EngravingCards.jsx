import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
import shareImage from '../assets/share.png'
import '../styles/EngravingCards.css'

// 별자리(after)를 tight viewBox로 그리기
function Constellation({ after, className }) {
  if (!after) return null
  const xs = after.points.map((p) => p.x)
  const ys = after.points.map((p) => p.y)
  const pad = 8
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const w = Math.max(...xs) + pad - minX
  const h = Math.max(...ys) + pad - minY
  const pm = Object.fromEntries(after.points.map((p) => [p.id, p]))
  return (
    <svg
      className={className}
      viewBox={`${minX} ${minY} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {after.connections.map(([a, b], i) => {
        const p1 = pm[a]
        const p2 = pm[b]
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
      {after.points.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="3" fill="currentColor" />
      ))}
    </svg>
  )
}

function EngravingCards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null) // 선택된 카드 상세(오버레이). null이면 닫힘
  const [saved, setSaved] = useState(false) // "저장되었습니다." 토스트
  const [shareOpen, setShareOpen] = useState(false) // 카드 공유하기 → share 이미지 모달

  // 카드 모음 조회: GET /api/engravings/cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        let data
        if (USE_MOCK) {
          data = mockEngravings.map((e) => ({
            id: e.id,
            constellationName: e.constellationName,
            constellationData: e.constellationData.after,
            createdAt: e.createdAt,
          }))
        } else {
          const res = await axios.get('/api/engravings/cards')
          data = res.data?.data?.records ?? res.data?.data?.cards ?? []
        }
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setCards(sorted)
      } catch (err) {
        console.error('카드 모음 조회 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCards()
  }, [])

  // 카드 상세 조회: GET /api/engravings/{id} (목록엔 keywords가 없어 상세로 받아옴)
  const openDetail = async (card) => {
    try {
      let d
      if (USE_MOCK) {
        d = mockEngravings.find((e) => e.id === card.id)
      } else {
        const res = await axios.get(`/api/engravings/${card.id}`)
        d = res.data?.data
      }
      setDetail(d || null)
      setSaved(false)
    } catch (err) {
      console.error('카드 상세 조회 실패:', err)
    }
  }

  return (
    <div className="cards">
      <header className="cards__header">
        <button className="cards__back" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 className="cards__title">저장된 카드 전체 보기</h1>
      </header>

      {/* 카드가 겹치지 않고 몇 장이든 계속 아래로 쌓이는 세로 리스트 */}
      <div className="cards__list">
        {loading ? (
          <p className="cards__state">불러오는 중...</p>
        ) : cards.length === 0 ? (
          <p className="cards__state">아직 저장된 카드가 없어요.</p>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="cards__item"
              onClick={() => openDetail(card)}
            >
              <img src={cardImage} alt="" className="cards__card-bg" />
              <div className="cards__detail-const">
                <Constellation
                  after={card.constellationData}
                  className="cards__card-svg"
                />
              </div>
              <img src={cardText} alt="" className="cards__detail-logo" />
              <span className="cards__detail-name">{card.constellationName}</span>
            </div>
          ))
        )}
      </div>

      {/* 카드 선택 시 상세 오버레이 (화면 9.3) — 헤더/하단 탭까지 다 덮도록 폰 프레임 전체에 렌더 */}
      {detail &&
        createPortal(
          <div
            className="cards__detail"
            onClick={() => setDetail(null)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              className="cards__detail-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cards__detail-card">
                <img src={cardImage} alt="" className="cards__card-bg" />
                <div className="cards__detail-const">
                  <Constellation
                    after={detail.constellationData?.after}
                    className="cards__card-svg"
                  />
                </div>
                <img src={cardText} alt="" className="cards__detail-logo" />
                <span className="cards__detail-name">
                  {detail.constellationName}
                </span>
              </div>

              <div className="cards__detail-info">
                <p>별자리 이름: {detail.constellationName}</p>
                <p>
                  AI 분석 키워드:{' '}
                  {Array.isArray(detail.keywords)
                    ? detail.keywords.join(' · ')
                    : ''}
                </p>
              </div>

              {saved && <div className="cards__detail-toast">저장되었습니다.</div>}

              <div className="cards__detail-buttons">
                <button
                  className="cards__detail-share"
                  onClick={() => setShareOpen(true)}
                >
                  카드 공유하기
                </button>
                <button
                  className="cards__detail-save"
                  onClick={() => setSaved(true)}
                >
                  카드 저장하기
                </button>
              </div>
            </div>
          </div>,
          document.querySelector('.phone-frame') || document.body,
        )}

      {/* 카드 공유하기 → share 이미지 모달 */}
      {shareOpen &&
        createPortal(
          <div className="cards__share" onClick={() => setShareOpen(false)}>
            <img
              src={shareImage}
              alt="공유"
              className="cards__share-img"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.querySelector('.phone-frame') || document.body,
        )}
    </div>
  )
}

export default EngravingCards
