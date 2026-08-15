import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import EngravingConstellation from '../components/EngravingConstellation.jsx'
import '../styles/EngravingNaming.css'

function EngravingNaming() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | success | error
  const [engraving, setEngraving] = useState(null)

  const [newName, setNewName] = useState('')
  const [decided, setDecided] = useState(false) // 저장되면 안내문구 변경 + 하단 버튼 활성화
  const [zoom, setZoom] = useState(null) // 확대해서 볼 별자리 데이터 (null이면 안 띄움)

  // 5.1에서 결정한(재생성 반영된) 각인 상세 조회: GET /api/engravings/{id}
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

  const formatKeywords = (keywords) =>
    Array.isArray(keywords) ? keywords.join(' · ') : keywords || ''

  // AI 추천 이름 사용 → 입력칸에 자동으로 채워줌 (토스트 없음)
  const handleUseAiName = () => {
    setNewName(engraving.constellationName)
  }

  // 직접 입력한 이름 저장 → PATCH /api/engravings/{id}
  const handleSaveName = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const aiName = engraving.constellationName
    try {
      // AI 추천 이름과 다를 때만 API 호출 (같으면 생성 시 이름 그대로 사용)
      if (trimmed !== aiName) {
        if (USE_MOCK) {
          const target = mockEngravings.find((e) => String(e.id) === String(id))
          if (target) target.constellationName = trimmed
          setEngraving((prev) => ({ ...prev, constellationName: trimmed }))
        } else {
          await axios.patch(`/api/engravings/${id}`, {
            constellationName: trimmed,
          })
          setEngraving((prev) => ({ ...prev, constellationName: trimmed }))
        }
      }
      setDecided(true) // 안내문구 "저장이 완료되었어요." + 하단 버튼 활성화
    } catch (err) {
      console.error('이름 저장 실패:', err)
    }
  }

  if (status === 'loading') {
    return (
      <div className="naming">
        <p className="naming__state">불러오는 중...</p>
      </div>
    )
  }
  if (status === 'error' || !engraving) {
    return (
      <div className="naming">
        <p className="naming__state">각인을 불러오지 못했어요.</p>
      </div>
    )
  }

  const beforeData = engraving.constellationData.before
  const afterData = engraving.constellationData.after
  const aiName = engraving.constellationName // AI가 각인 생성 시 지어준 이름

  return (
    <div className="naming">
      {/* 헤더 */}
      <header className="naming__header">
        <button className="naming__back" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 className="naming__title">각인 미리 보기</h1>
      </header>

      {/* Before / After */}
      <div className="naming__constellations">
        <figure className="naming__const">
          <div
            className="naming__const-box naming__const-box--before"
            onClick={() => setZoom({ data: beforeData, space: 'grid' })}
          >
            <EngravingConstellation data={beforeData} space="grid" size={140} />
          </div>
          <figcaption className="naming__const-label">Before</figcaption>
        </figure>
        <figure className="naming__const">
          <div
            className="naming__const-box naming__const-box--after"
            onClick={() => setZoom({ data: afterData, space: 'canvas' })}
          >
            <EngravingConstellation data={afterData} space="canvas" size={140} />
          </div>
          <figcaption className="naming__const-label">After</figcaption>
        </figure>
      </div>

      {/* 플레이 스토리 */}
      <section className="naming__story">
        <p className="naming__story-heading">당신의 플레이 스토리는</p>
        <p className="naming__story-keywords">{formatKeywords(engraving.keywords)}</p>
        <p className="naming__story-comment">{engraving.comment}</p>
      </section>

      {/* 각인 이름 짓기 (AI 추천) */}
      <section className="naming__field">
        <label className="naming__label">각인 이름 짓기</label>
        <p className="naming__desc">AI가 추천한 이름을 사용하거나 직접 입력하세요.</p>
        <div className="naming__ai-box">
          <div className="naming__ai-text">
            <span className="naming__ai-caption">AI가 추천해주는 이름</span>
            <span className="naming__ai-name">{aiName}</span>
          </div>
          <button className="naming__ai-btn" onClick={handleUseAiName}>
            이름 사용
          </button>
        </div>
      </section>

      {/* 나만의 각인 이름 입력 */}
      <section className="naming__field">
        <label className="naming__label">나만의 각인 이름 입력</label>
        <div className="naming__input-row">
          <input
            className="naming__input"
            type="text"
            placeholder="이름을 지어주세요."
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              setDecided(false) // 다시 편집하면 안내문구/버튼 원래대로
            }}
          />
          <button className="naming__save-name-btn" onClick={handleSaveName}>
            이름 저장
          </button>
        </div>
        <p className="naming__help">
          {decided ? '저장이 완료되었어요.' : '각인 이름은 나중에 또 수정할 수 있어요.'}
        </p>
      </section>

      {/* 하단 저장 버튼 (이름 확정 전엔 비활성화) */}
      <button
        className={`naming__save-btn${!decided ? ' naming__save-btn--inactive' : ''}`}
        onClick={() => navigate(`/engraving/card/${id}`)}
        disabled={!decided}
      >
        나만의 별자리 저장하기
      </button>

      {/* 이미지 확대 라이트박스 (네비바·하단탭까지 덮도록 폰 프레임 전체에 렌더) */}
      {zoom &&
        createPortal(
          <div className="naming__lightbox" onClick={() => setZoom(null)}>
            <div
              className="naming__lightbox-img"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="naming__lightbox-close"
                onClick={() => setZoom(null)}
                aria-label="닫기"
              >
                <span className="naming__lightbox-close-bar" />
                <span className="naming__lightbox-close-bar" />
              </button>
              <EngravingConstellation data={zoom.data} space={zoom.space} size={290} />
            </div>
          </div>,
          document.querySelector('.phone-frame') || document.body,
        )}
    </div>
  )
}

export default EngravingNaming
