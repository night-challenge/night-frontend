import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
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

// 원형 휠 배치 파라미터
const CX = -173 // 원 중심 x (왼쪽 화면 바깥) → 앞 카드가 가운데로 오게
const RADIUS = 340 // 반지름
const STEP = 26 // 카드 사이 각도(도)
const MIN_SLOTS = 9 // 휠을 채우는 최소 슬롯 수 (부족분은 검은 플레이스홀더)
const DRAG_SENS = 0.28 // 드래그 1px당 회전 각도

function EngravingCards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [rotation, setRotation] = useState(0) // 휠 회전각(도)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ active: false, startY: 0, startRot: 0 })
  const [detail, setDetail] = useState(null) // 선택된 카드 상세(오버레이). null이면 닫힘
  const [saved, setSaved] = useState(false) // "저장되었습니다." 토스트

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
      }
    }
    fetchCards()
  }, [])

  // 실제 카드 + 검은 플레이스홀더(아직 생성되지 않은 카드)로 휠 채우기
  const slots = [...cards]
  while (slots.length < MIN_SLOTS) {
    slots.push({ placeholder: true, id: `placeholder-${slots.length}` })
  }
  const maxRot = (slots.length - 1) * STEP
  const clampRot = (r) => Math.max(0, Math.min(r, maxRot))
  // 정면(각도 0)에 가장 가까운 슬롯이 활성
  const activeIndex = clampRot(Math.round(rotation / STEP) * STEP) / STEP

  // ===== 드래그로 휠 돌리기 =====
  const onPointerDown = (e) => {
    drag.current = { active: true, startY: e.clientY, startRot: rotation }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dy = e.clientY - drag.current.startY
    setRotation(clampRot(drag.current.startRot + dy * DRAG_SENS))
  }
  const onPointerUp = (e) => {
    if (!drag.current.active) return
    const moved = Math.abs(e.clientY - drag.current.startY)
    drag.current.active = false
    setDragging(false)
    if (moved < 6) {
      // 거의 안 움직였으면 탭 → 정면 카드 상세 열기
      const front = slots[activeIndex]
      if (front && !front.placeholder) openDetail(front)
    } else {
      setRotation((r) => clampRot(Math.round(r / STEP) * STEP)) // 가까운 카드로 스냅
    }
  }
  const onPointerLeave = () => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    setRotation((r) => clampRot(Math.round(r / STEP) * STEP))
  }

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

      <div
        className={`cards__deck${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        {slots.map((slot, i) => {
          const angle = i * STEP - rotation // 정면=0
          const rad = (angle * Math.PI) / 180
          const left = CX + RADIUS * Math.cos(rad)
          const topOffset = RADIUS * Math.sin(rad)
          const active = !slot.placeholder && i === activeIndex
          return (
            <div
              key={slot.id}
              className={`cards__card${active ? ' cards__card--active' : ''}${
                slot.placeholder ? ' cards__card--empty' : ''
              }`}
              style={{
                left: `${left}px`,
                top: `calc(50% + ${topOffset}px)`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)${
                  active ? ' scale(1.06)' : ''
                }`,
                zIndex: active ? 100 : 50 - Math.abs(i - activeIndex),
              }}
            >
              {active && (
                <>
                  <img src={cardImage} alt="" className="cards__card-bg" />
                  <div className="cards__card-const">
                    <Constellation
                      after={slot.constellationData}
                      className="cards__card-svg"
                    />
                  </div>
                  <img src={cardText} alt="" className="cards__card-logo" />
                  <span className="cards__card-name">{slot.constellationName}</span>
                </>
              )}
            </div>
          )
        })}

        {/* 카드 선택 시 상세 오버레이 (화면 9.3) */}
        {detail && (
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
                <div className="cards__card-const">
                  <Constellation
                    after={detail.constellationData?.after}
                    className="cards__card-svg"
                  />
                </div>
                <img src={cardText} alt="" className="cards__card-logo" />
                <span className="cards__card-name">
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
                <button className="cards__detail-share">카드 공유하기</button>
                <button
                  className="cards__detail-save"
                  onClick={() => setSaved(true)}
                >
                  카드 저장하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EngravingCards
