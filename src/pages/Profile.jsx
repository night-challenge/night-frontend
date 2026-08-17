import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockMypage, mockEngravings } from '../data/engravingData'
import cardImage from '../assets/card_image.png'
import cardText from '../assets/card_txt.png'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/Profile.css'

// 계정 및 설정 항목
const settings = ['알림 설정', '개인정보 처리방침', '이용약관', '고객센터 문의', '로그아웃']

function Profile() {
  const navigate = useNavigate()
  const [mypage, setMypage] = useState(null)
  const [cardDetail, setCardDetail] = useState(null) // recentCard 상세(썸네일/키워드용)

  // 마이페이지 메인 조회: GET /api/mypage
  // recentCard 는 id+이름만 오므로, 카드 썸네일용 상세는 GET /api/engravings/{id}로 확보
  useEffect(() => {
    const fetchMypage = async () => {
      try {
        let mp
        if (USE_MOCK) {
          mp = mockMypage
        } else {
          const res = await axios.get('/api/mypage')
          mp = res.data?.data
        }
        setMypage(mp)

        if (mp?.recentCard) {
          if (USE_MOCK) {
            setCardDetail(
              mockEngravings.find((e) => e.id === mp.recentCard.id) || null,
            )
          } else {
            const d = await axios.get(`/api/engravings/${mp.recentCard.id}`)
            setCardDetail(d.data?.data)
          }
        }
      } catch (err) {
        console.error('마이페이지 조회 실패:', err)
      }
    }
    fetchMypage()
  }, [])

  const formatKeywords = (k) => (Array.isArray(k) ? k.join(' · ') : k || '')

  // 최근 카드 별자리 (tight viewBox)
  const renderConstellation = (after) => {
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
        className="profile__card-svg"
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

  if (!mypage) {
    return (
      <div className="profile">
        <p className="profile__loading">불러오는 중...</p>
      </div>
    )
  }

  const recentCard = mypage.recentCard // { id, constellationName } | null

  return (
    <div className="profile">
      {/* 유저 정보 */}
      <section className="profile__user">
        <div className="profile__avatar">
          <img src={mcmLogo} alt="MCM" className="profile__avatar-logo" />
        </div>
        <div className="profile__user-text">
          <p className="profile__nickname">{mypage.nickname}</p>
          <p className="profile__userid">{mypage.userIdDisplay}</p>
        </div>
      </section>

      {/* 신청한 각인 보기 (신청 건 없으면 비활성화) */}
      <button
        className="profile__request-btn"
        onClick={() => navigate('/engraving-requests')}
        disabled={!mypage.hasEngravingRequest}
      >
        신청한 각인 보기
      </button>

      {/* MCM 바로가기 */}
      <button className="profile__row" onClick={() => {}}>
        <span>MCM 바로가기 버튼</span>
        <span className="profile__row-chevron">›</span>
      </button>

      {/* 카드 모음 (recentCard 없으면 카드 미표시) */}
      <section className="profile__cards">
        <h2 className="profile__section-title">카드 모음</h2>
        {recentCard ? (
          <div className="profile__card">
            <div className="profile__card-thumb">
              <img src={cardImage} alt="" className="profile__card-bg" />
              <div className="profile__card-const">
                {renderConstellation(cardDetail?.constellationData?.after)}
              </div>
              <img src={cardText} alt="" className="profile__card-logo" />
            </div>
            <div className="profile__card-info">
              <div className="profile__card-top">
                <span className="profile__card-name">
                  {recentCard.constellationName}
                </span>
                <span className="profile__card-more">···</span>
              </div>
              <span className="profile__card-keywords">
                {formatKeywords(cardDetail?.keywords)}
              </span>
            </div>
          </div>
        ) : (
          <p className="profile__no-card">아직 저장된 카드가 없어요.</p>
        )}
      </section>

      <button
        className="profile__save-btn"
        onClick={() => navigate('/engravings/cards')}
      >
        저장된 카드 전체 보기
      </button>

      {/* 계정 및 설정 */}
      <section className="profile__settings">
        <h2 className="profile__section-title">계정 및 설정</h2>
        {settings.map((label) => (
          <button key={label} className="profile__setting-item" onClick={() => {}}>
            {label}
          </button>
        ))}
      </section>
    </div>
  )
}

export default Profile
