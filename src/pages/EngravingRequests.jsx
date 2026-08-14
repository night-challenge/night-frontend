import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravingRequests } from '../data/engravingData'
import travelSuitcase from '../assets/travel_suitcase_option1.svg'
import perfume from '../assets/fashion_perfume_option1_detail.svg'
import bag from '../assets/bag_brown_detail.svg'
import airpod from '../assets/lifestyle_airpod_case_detail.svg'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/EngravingRequests.css'

// product.optionName 으로 제품 이미지 매핑 (API가 이미지 URL을 주지 않으므로 프론트에서 매핑)
function getProductImage(product) {
  const name = product?.optionName || ''
  if (name.includes('수트케이스') || name.includes('트래블')) return travelSuitcase
  if (name.includes('퍼퓸') || name.includes('향수')) return perfume
  if (name.includes('토트') || name.includes('가방') || name.includes('백')) return bag
  if (name.includes('에어팟') || name.includes('케이스')) return airpod
  return travelSuitcase // 기본값
}

// 별자리(after)를 tight viewBox로 그리는 헬퍼
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

function EngravingRequests() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // 신청 목록 조회: GET /api/engraving-requests?status=신청완료
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let data
        if (USE_MOCK) {
          data = mockEngravingRequests
        } else {
          const res = await axios.get('/api/engraving-requests', {
            params: { status: '신청완료' },
          })
          data = res.data?.data?.records ?? []
        }
        setRecords(data)
      } catch (err) {
        console.error('신청 목록 조회 실패:', err)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const formatKeywords = (k) => (Array.isArray(k) ? k.join(' · ') : k || '')

  // 신청 각인 취소: PATCH /api/engraving-requests/{id}/cancel
  const handleCancel = async () => {
    const target = records[index]
    if (!target) return
    try {
      if (!USE_MOCK) {
        await axios.patch(`/api/engraving-requests/${target.id}/cancel`)
      }
      // 취소한 건 목록에서 제거하고 다음 건 표시
      const next = records.filter((_, i) => i !== index)
      setRecords(next)
      setIndex((prev) => Math.min(prev, Math.max(0, next.length - 1)))
    } catch (err) {
      console.error('신청 취소 실패:', err)
    }
  }

  if (loading) {
    return (
      <div className="req">
        <p className="req__state">불러오는 중...</p>
      </div>
    )
  }

  // 빈 화면 (신청한 각인 없음)
  if (records.length === 0) {
    return (
      <div className="req">
        <header className="req__header">
          <button className="req__back" onClick={() => navigate(-1)}>
            ‹
          </button>
          <h1 className="req__title">신청한 각인 보기</h1>
        </header>

        <div className="req__empty-wrap">
          <img src={mcmLogo} alt="" className="req__empty-logo" />
          <p className="req__empty-title">신청한 각인이 없습니다.</p>
          <p className="req__empty-desc">
            {'게임을 플레이 하시고 나만의 각인을 만들어\n제품에 새겨보세요.'}
          </p>
        </div>

        <button className="req__empty-btn" onClick={() => navigate('/game')}>
          게임하러 가기
        </button>
      </div>
    )
  }

  const record = records[index]
  const eng = record.engraving
  const single = records.length === 1

  return (
    <div className="req">
      <header className="req__header">
        <button className="req__back" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 className="req__title">신청한 각인 보기</h1>
      </header>

      {/* 제품 코드 */}
      <section className="req__section">
        <h2 className="req__label">제품 코드</h2>
        <div className="req__code-box">{record.productCode}</div>
        <p className="req__code-desc">
          제품을 주문하실 때 코드를 입력하시면
          <br />
          선택하신 각인이 제품에 새겨져 드립니다.
        </p>
      </section>

      {/* 선택한 제품 */}
      <section className="req__section">
        <h2 className="req__label">선택한 제품</h2>
        <div className="req__product">
          <img
            src={getProductImage(record.product)}
            alt={record.product?.optionName || ''}
            className="req__product-img"
          />
        </div>
      </section>

      {/* 선택한 각인 */}
      <section className="req__section">
        <h2 className="req__label">선택한 각인</h2>
        <div className="req__constellation">
          <Constellation after={eng?.constellationData} className="req__const-svg" />
        </div>
      </section>

      {/* 선택한 각인의 정보 */}
      <section className="req__section">
        <h2 className="req__label">선택한 각인의 정보</h2>
        <div className="req__info-card">
          <div className="req__info-thumb">
            <Constellation
              after={eng?.constellationData}
              className="req__info-svg"
            />
          </div>
          <div className="req__info-text">
            <p className="req__info-name">{eng?.constellationName}</p>
            <p className="req__info-keywords">{formatKeywords(eng?.keywords)}</p>
            <p className="req__info-comment">{eng?.comment}</p>
          </div>
        </div>
      </section>

      {/* 페이지네이션 (신청 건이 1개면 화살표 비활성화) */}
      <div className="req__pagination">
        <button
          className="req__arrow"
          onClick={() => setIndex((i) => i - 1)}
          disabled={single || index === 0}
        >
          ‹
        </button>
        <span className="req__page">{index + 1}</span>
        <button
          className="req__arrow"
          onClick={() => setIndex((i) => i + 1)}
          disabled={single || index === records.length - 1}
        >
          ›
        </button>
      </div>

      {/* 신청 각인 취소하기 */}
      <button className="req__cancel-btn" onClick={handleCancel}>
        신청 각인 취소하기
      </button>
    </div>
  )
}

export default EngravingRequests
