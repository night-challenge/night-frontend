import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import EngravingConstellation from '../components/EngravingConstellation.jsx'
import ConstellationThumb from '../components/ConstellationThumb.jsx'
import '../styles/EngravingDetail.css'

function EngravingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [engraving, setEngraving] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | error
  const [name, setName] = useState('') // 현재(기존) 이름
  const [newName, setNewName] = useState('') // 입력한 새 이름
  const [toast, setToast] = useState(null) // 토스트 { id, msg }
  const toastTimer = useRef(null)
  const [saved, setSaved] = useState(false) // 이름 수정 성공해야 저장 버튼 활성화

  // 상세 조회: GET /api/engravings/{id}
  useEffect(() => {
    const fetchDetail = async () => {
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
        setName(data.constellationName)
        setStatus('success')
      } catch (err) {
        console.error('각인 상세 조회 실패:', err)
        setStatus('error')
      }
    }
    fetchDetail()
  }, [id])

  // 토스트 잠깐 보여주기 (매번 새 id로 애니메이션 재시작)
  const showToast = (message) => {
    setToast({ id: Date.now(), msg: message })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  // 이름 수정: PATCH /api/engravings/{id}
  const handleUpdateName = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return // 버튼이 비활성화라 사실상 안 들어옴
    if (trimmed === name) {
      // 이름이 바뀌지 않았으면 토스트로 안내 (백엔드도 동일값이면 400 반환)
      showToast('변경된 사항이 없습니다.')
      return
    }
    try {
      if (USE_MOCK) {
        // mock 데이터에도 반영 → 목록으로 돌아가도 바뀐 이름 유지
        const target = mockEngravings.find((e) => String(e.id) === String(id))
        if (target) target.constellationName = trimmed
      } else {
        // 요청 body: { constellationName } / 성공 message: "수정되었습니다."
        await axios.patch(`/api/engravings/${id}`, { constellationName: trimmed })
      }
      setName(trimmed) // 화면의 기존 이름 갱신
      setNewName('')
      setSaved(true) // 수정 성공 → 저장 버튼 활성화
      showToast('수정되었습니다.')
    } catch (err) {
      console.error('이름 수정 실패:', err)
      // 백엔드 메시지 그대로 표시 (400: "변경된 사항이 없습니다." / 404: "존재하지 않는 각인입니다.")
      showToast(err.response?.data?.message || '수정에 실패했어요.')
    }
  }

  const formatKeywords = (keywords) =>
    Array.isArray(keywords) ? keywords.join(' · ') : keywords || ''

  if (status === 'loading') {
    return (
      <div className="detail">
        <p className="detail__state">불러오는 중...</p>
      </div>
    )
  }
  if (status === 'error' || !engraving) {
    return (
      <div className="detail">
        <p className="detail__state">각인을 불러오지 못했어요.</p>
      </div>
    )
  }

  // before/after 데이터 (명세서: constellationData 안에 before/after 분리)
  const beforeData = engraving.constellationData?.before
  const afterData = engraving.constellationData?.after

  // Before는 게임 끝나고 나온 화면과 똑같이(체스판 격자 + 이동 화살표) 보여준다.
  const beforeGroups = beforeData?.points
    ? [{ points: beforeData.points.map((p) => ({ x: p.x, y: p.y })) }]
    : []

  return (
    <div className="detail">
      {/* 헤더: 뒤로가기 + 제목 */}
      <header className="detail__header">
        <button className="detail__back" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 className="detail__title">각인 미리 보기</h1>
      </header>

      {/* Before / After 별자리 */}
      <div className="detail__constellations">
        <figure className="detail__const">
          <div className="detail__const-box detail__const-box--before">
            <ConstellationThumb data={beforeGroups} size={140} />
          </div>
          <figcaption className="detail__const-label">Before</figcaption>
        </figure>
        <figure className="detail__const">
          <div className="detail__const-box detail__const-box--after">
            <EngravingConstellation data={afterData} space="canvas" size={140} />
          </div>
          <figcaption className="detail__const-label">After</figcaption>
        </figure>
      </div>

      {/* 플레이 스토리 */}
      <section className="detail__story">
        <p className="detail__story-heading">당신의 플레이 스토리는</p>
        <p className="detail__story-keywords">{formatKeywords(engraving.keywords)}</p>
        <p className="detail__story-comment">{engraving.comment}</p>
      </section>

      {/* 기존 이름 */}
      <section className="detail__field">
        <label className="detail__label">기존 이름</label>
        <div className="detail__readonly">{name}</div>
      </section>

      {/* 나만의 각인 이름 입력 (기존 이름 칸과 18px 거리) */}
      <section className="detail__field detail__field--new-name">
        <label className="detail__label">나만의 각인 이름 입력</label>
        <div className="detail__input-row">
          <input
            className="detail__input"
            type="text"
            placeholder="이름을 지어주세요."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="detail__edit-btn" onClick={handleUpdateName}>
            이름 수정
          </button>
        </div>
        <p className="detail__help">각인 이름은 나중에 또 수정할 수 있어요.</p>
      </section>

      {/* 하단 저장 버튼 */}
      <button
        className={`detail__save-btn${!saved ? ' detail__save-btn--inactive' : ''}`}
        onClick={() => navigate('/engraving')}
        disabled={!saved}
      >
        나만의 별자리 저장하기
      </button>

      {/* 토스트 */}
      {toast && (
        <div key={toast.id} className="detail__toast">
          {toast.msg}
        </div>
      )}
    </div>
  )
}

export default EngravingDetail
