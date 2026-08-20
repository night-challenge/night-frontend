import { useEffect, useRef, useState } from 'react'
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

// 원형 휠 배치 파라미터
// ⚠️ 예전엔 세로 위치까지 원(RADIUS*sin(각도))으로 계산해서, 중심에서 먼 카드일수록
// (각도가 90도에 가까워질수록) sin 곡선이 평평해지면서 카드 사이 세로 간격이
// 저절로 줄어드는 구조였다 — RADIUS를 아무리 키워도 카드가 많아지면 결국
// 바깥쪽 카드들끼리 다시 겹쳤던 원인이 이거. 그래서 세로 위치(topOffset)는
// SPACING으로 무조건 균등하게 고정하고, 기울기/좌우 곡선(휘어짐)만 원형 계산을
// 쓰되 일정 각도 이상은 더 안 벌어지게 클램프해서 "부채꼴처럼 보이는 효과"만 남긴다.
const CX = -460.5 // 좌우 곡선 원점 x — 앞(정면) 카드가 화면(375px) 정중앙(187.5px)에 오도록 CX+RADIUS=187.5로 맞춤
const RADIUS = 648 // 좌우 곡선(휘어짐) 반지름 — 세로 간격엔 영향 없음, 크게 줘서 부채꼴이 확실히 보이게
const STEP = 27 // 카드 한 칸당 각도(도) — 기울기/곡선 계산용
const MAX_TILT = 45 // 기울기·좌우 곡선이 이 각도에서 더 이상 안 커짐(카드가 회전으로 서로 침범하지 않게)
const SPACING = 300 // 카드 사이 세로 간격(px, 항상 고정) — 카드가 264x145로 커진 만큼 같이 키움(MAX_TILT 45도에서 회전된 카드 크기 ~289px보다 살짝만 여유)
const PAD_PER_SIDE = 3 // 카드가 몇 개든 상관없이 위/아래에 항상 검은 카드가 보이게 고정 패딩
const DRAG_SENS = 0.28 // 드래그 1px당 회전 각도

function EngravingCards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [rotation, setRotation] = useState(0) // 휠 회전각(도)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ active: false, startY: 0, startRot: 0 })
  const [detail, setDetail] = useState(null) // 선택된 카드 상세(오버레이). null이면 닫힘
  const [toast, setToast] = useState(null) // 토스트 { id, msg } | null
  const toastTimer = useRef(null)
  const [shareOpen, setShareOpen] = useState(false) // 카드 공유하기 → share 이미지 모달

  // 토스트 잠깐 보여주기 (매번 새 id로 애니메이션 재시작 → 눌렀을 때마다 매번 다시 뜸)
  const showToast = (message) => {
    setToast({ id: Date.now(), msg: message })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

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

  // 검은 플레이스홀더를 실제 카드 앞/뒤로 항상 고정 개수만큼 채운다 →
  // 카드가 몇 장이든(9장이 넘어도) 맨 위/맨 아래로 끝까지 스크롤해도
  // 항상 검은 카드가 보이게(리스트가 꽉 차서 끝나 보이지 않도록)
  const slots = [
    ...Array.from({ length: PAD_PER_SIDE }, (_, i) => ({
      placeholder: true,
      id: `placeholder-b-${i}`,
    })),
    ...cards,
    ...Array.from({ length: PAD_PER_SIDE }, (_, i) => ({
      placeholder: true,
      id: `placeholder-a-${i}`,
    })),
  ]

  // 카드 로딩 끝나면 최신 카드(cards[0], 정렬 기준 가장 최근)가 정면에 오도록 회전값 초기화
  useEffect(() => {
    if (cards.length > 0) {
      setRotation(PAD_PER_SIDE * STEP)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  const maxRot = (slots.length - 1) * STEP
  const clampRot = (r) => Math.max(0, Math.min(r, maxRot))
  // 정면(각도 0)에 가장 가까운 슬롯이 활성
  const activeIndex = clampRot(Math.round(rotation / STEP) * STEP) / STEP

  // 실제 카드가 있는 인덱스만 모아서, 놓았을 때 검은 플레이스홀더가 아니라
  // 항상 실제 카드 중 가장 가까운 것에 스냅되게 함
  const realIndices = slots.reduce((acc, s, i) => {
    if (!s.placeholder) acc.push(i)
    return acc
  }, [])
  const snapToNearestReal = (r) => {
    if (realIndices.length === 0) return clampRot(Math.round(r / STEP) * STEP)
    let best = realIndices[0]
    let bestDiff = Infinity
    for (const idx of realIndices) {
      const diff = Math.abs(idx * STEP - r)
      if (diff < bestDiff) {
        bestDiff = diff
        best = idx
      }
    }
    return best * STEP
  }

  // ===== 드래그로 휠 돌리기 =====
  // (손가락/커서를 아래로 내리면 다음 카드로, 위로 올리면 이전 카드로 넘어가도록
  //  방향을 반대로 잡아준다 — 예전엔 이게 반대라 위/아래가 뒤집힌 느낌이었음)
  const onPointerDown = (e) => {
    drag.current = { active: true, startY: e.clientY, startRot: rotation }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dy = e.clientY - drag.current.startY
    setRotation(clampRot(drag.current.startRot - dy * DRAG_SENS))
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
      setRotation((r) => snapToNearestReal(r)) // 검은 카드 말고 실제 카드로만 스냅
    }
  }
  // ⚠️ onPointerLeave에서는 드래그를 끝내지 않는다 — pointerdown에서
  // setPointerCapture를 걸어놨기 때문에, 손가락/커서가 카드 영역 밖으로
  // 나가도 move/up 이벤트는 계속 이 요소로 들어온다. 근데 pointerleave는
  // capture와 무관하게 "실제 좌표가 요소 밖으로 나감"을 기준으로 발생해서,
  // 여기서 드래그를 끊어버리면 세로로 조금만 크게 드래그해도 중간에
  // 끊기는 문제가 있었다 (드래그가 잘 안 된다는 문제의 원인).

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
      setToast(null)
    } catch (err) {
      console.error('카드 상세 조회 실패:', err)
    }
  }

  // 이미지 로드를 Promise로 (canvas에 그리려면 로드가 끝나야 함)
  const loadImageEl = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  // 카드 저장하기: 확대 카드(cards__detail-*)와 똑같은 배치로 canvas에 그려서
  // 실제 PNG 이미지 파일로 다운로드한다. 별도 서버 API 없이 프론트에서만 처리.
  const handleSaveCard = async () => {
    if (!detail) return
    try {
      const SCALE = 2 // 저장 화질을 위해 2배 해상도로 렌더
      const CW = 300 * SCALE
      const CH = 180 * SCALE
      const canvas = document.createElement('canvas')
      canvas.width = CW
      canvas.height = CH
      const ctx = canvas.getContext('2d')

      // 1) 카드 배경
      const bg = await loadImageEl(cardImage)
      ctx.drawImage(bg, 0, 0, CW, CH)

      // 2) 별자리(after) — Constellation 컴포넌트와 동일한 tight viewBox 로직으로 SVG를 직접 만들어 그린다
      const after = detail.constellationData?.after
      if (after) {
        const xs = after.points.map((p) => p.x)
        const ys = after.points.map((p) => p.y)
        const pad = 8
        const minX = Math.min(...xs) - pad
        const minY = Math.min(...ys) - pad
        const w = Math.max(...xs) + pad - minX
        const h = Math.max(...ys) + pad - minY
        const pm = Object.fromEntries(after.points.map((p) => [p.id, p]))
        const lines = after.connections
          .map(([a, b]) => {
            const p1 = pm[a]
            const p2 = pm[b]
            if (!p1 || !p2) return ''
            return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`
          })
          .join('')
        const dots = after.points
          .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff"/>`)
          .join('')
        const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}">${lines}${dots}</svg>`
        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
        const constImg = await loadImageEl(svgDataUrl)
        ctx.drawImage(constImg, 10 * SCALE, 10 * SCALE, 190 * SCALE, 145 * SCALE)
      }

      // 3) 카드 텍스트(로고) 이미지
      const logo = await loadImageEl(cardText)
      const logoW = 84 * SCALE
      const logoH = logoW * (logo.height / logo.width)
      ctx.drawImage(logo, 8 * SCALE, 8 * SCALE, logoW, logoH)

      // 4) 각인 이름 텍스트
      ctx.fillStyle = '#fff'
      ctx.font = `${9 * SCALE}px 'Pretendard', sans-serif`
      ctx.textBaseline = 'bottom'
      ctx.fillText(detail.constellationName || '', 66 * SCALE, CH - 10 * SCALE)

      // 5) PNG로 변환해서 다운로드
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('이미지 생성 실패')
      const url = URL.createObjectURL(blob)
      const safeName = (detail.constellationName || 'mcm-card').replace(/[\\/:*?"<>|]/g, '')
      const a = document.createElement('a')
      a.href = url
      a.download = `${safeName || 'mcm-card'}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      showToast('저장되었습니다.')
    } catch (err) {
      console.error('카드 저장 실패:', err)
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
        onPointerCancel={onPointerUp}
      >
        {slots.map((slot, i) => {
          const rawAngle = i * STEP - rotation // 정면=0, 카드 몇 칸 떨어졌는지(연속값)
          const offsetSteps = rawAngle / STEP // 정면에서 몇 칸 떨어졌는지(부호 있음)
          const tiltAngle = Math.max(-MAX_TILT, Math.min(MAX_TILT, rawAngle)) // 기울기·곡선은 여기서 멈춤
          const rad = (tiltAngle * Math.PI) / 180
          const left = CX + RADIUS * Math.cos(rad)
          const topOffset = offsetSteps * SPACING // 세로 간격은 항상 고정 → 절대 안 겹침
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
                transform: `translate(-50%, -50%) rotate(${tiltAngle}deg)${
                  active ? ' scale(1.06)' : ''
                }`,
                zIndex: active ? 100 : 50 - Math.abs(i - activeIndex),
              }}
            >
              {/* 플레이스홀더(아직 없는 카드)만 빈 검은 박스, 실제 카드는
                  정면이 아니어도 항상 얼굴이 보이게 → 드래그 중에도 서로 구분됨 */}
              {!slot.placeholder && (
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
                {toast && (
                  <div key={toast.id} className="cards__detail-toast">
                    {toast.msg}
                  </div>
                )}
              </div>

              <div className="cards__detail-buttons">
                <button
                  className="cards__detail-share"
                  onClick={() => setShareOpen(true)}
                >
                  카드 공유하기
                </button>
                <button className="cards__detail-save" onClick={handleSaveCard}>
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
