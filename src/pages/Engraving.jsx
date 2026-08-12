import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import EngraveCard from '../components/EngraveCard.jsx'
import mcmLogo from '../assets/mcm_logo_loding.png'
import '../styles/Engraving.css'

function Engraving() {
  const navigate = useNavigate()
  const [engravings, setEngravings] = useState([])
  // 화면 상태: loading(불러오는 중) | success | empty(각인 없음) | error
  const [status, setStatus] = useState('loading')

  // 화면 진입 시 보유 각인 목록 조회 (GET /api/engravings)
  useEffect(() => {
    const fetchEngravings = async () => {
      try {
        let data
        if (USE_MOCK) {
          // 백엔드 연동 전: mock 데이터 사용
          data = mockEngravings
        } else {
          // 백엔드 완성되면 mockData.js의 USE_MOCK만 false로 바꾸면 됨
          const res = await axios.get('/api/engravings')
          data = res.data?.data ?? [] // 공통 응답 { status, message, data }
        }

        // createdAt 내림차순(최신 먼저) 정렬
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )

        if (sorted.length === 0) {
          setStatus('empty')
        } else {
          setEngravings(sorted)
          setStatus('success')
        }
      } catch (err) {
        console.error('각인 목록 조회 실패:', err)
        setStatus('error')
      }
    }
    fetchEngravings()
  }, [])

  // 키워드 배열/문자열 → "침착함 · 역전 · 도전" 형태로 변환
  const formatKeywords = (keywords) =>
    Array.isArray(keywords) ? keywords.join(' · ') : keywords || ''

  return (
    <div className="engraving">
      <h1 className="engraving__title">각인 이름 수정하기</h1>
      {/* 저장된 각인이 없을 때(empty)는 소제목 숨김 */}
      {status !== 'empty' && (
        <p className="engraving__subtitle">최근 작업된 각인</p>
      )}

      {status === 'loading' && (
        <p className="engraving__state">불러오는 중...</p>
      )}
      {status === 'error' && (
        <p className="engraving__state">각인을 불러오지 못했어요.</p>
      )}

      {/* 저장된 각인이 하나도 없을 때 */}
      {status === 'empty' && (
        <>
          <div className="engraving__empty">
            <img src={mcmLogo} alt="" className="engraving__empty-logo" />
            <p className="engraving__empty-title">제작하신 각인이 없습니다.</p>
            <p className="engraving__empty-desc">
              {'게임을 플레이 하시고\n나만의 각인을 만들어 보세요.'}
            </p>
          </div>
          <button
            className="engraving__empty-btn"
            onClick={() => navigate('/game')}
          >
            게임하러 가기
          </button>
        </>
      )}

      {/* 각인이 있을 때: 카드 목록 + 페이지네이션 */}
      {status === 'success' && (
        <>
          <div className="engraving__list">
            {engravings.map((item) => (
              <EngraveCard
                key={item.id}
                constellation={item.constellationData?.after}
                title={item.constellationName}
                tags={formatKeywords(item.keywords)}
                description={item.comment}
                onClick={() => navigate(`/engraving/${item.id}`)}
              />
            ))}
          </div>

          <div className="pagination">
            <button className="pagination__arrow">‹</button>
            <span className="pagination__page">1</span>
            <button className="pagination__arrow">›</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Engraving
