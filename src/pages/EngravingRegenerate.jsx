import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import ConstellationThumb from '../components/ConstellationThumb.jsx'
import '../styles/EngravingRegenerate.css'

// mock 재생성: 점은 유지하고 연결선만 무작위로 새로 만든다 (매번 다른 모양)
function randomConnections(points) {
  const ids = points.map((p) => p.id)
  const shuffled = [...ids].sort(() => Math.random() - 0.5)
  const conns = []
  for (let i = 0; i < shuffled.length - 1; i++) {
    conns.push([shuffled[i], shuffled[i + 1]])
  }
  const extra = Math.floor(ids.length / 3)
  for (let i = 0; i < extra; i++) {
    const a = ids[Math.floor(Math.random() * ids.length)]
    const b = ids[Math.floor(Math.random() * ids.length)]
    if (a !== b) conns.push([a, b])
  }
  return conns
}

function EngravingRegenerate() {
  const navigate = useNavigate()

  // TODO: 게임 종료 후 넘어올 때 실제 각인 id/데이터를 route state로 받아 연결.
  //       지금은 mock 첫 번째 각인으로 미리보기.
  const engraving = mockEngravings[0]
  const beforeData = engraving.constellationData.before

  // after는 재생성 대상이라 state로 관리
  const [afterData, setAfterData] = useState(engraving.constellationData.after)
  const [loading, setLoading] = useState(false)

  // 다시 생성하기: PATCH /api/engravings/{id}/regenerate
  const handleRegenerate = async () => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        setAfterData({
          points: afterData.points,
          connections: randomConnections(afterData.points),
        })
      } else {
        const res = await axios.patch(`/api/engravings/${engraving.id}/regenerate`)
        setAfterData(res.data?.data?.after ?? res.data?.data)
      }
    } catch (err) {
      console.error('별자리 재생성 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="regen">
      {/* 헤더 */}
      <header className="regen__header">
        <button className="regen__back" onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 className="regen__title">각인 미리 보기</h1>
      </header>

      {/* Before / After 작은 썸네일 */}
      <div className="regen__thumbs">
        <figure className="regen__thumb">
          <div className="regen__thumb-box regen__thumb-box--before">
            <ConstellationThumb data={beforeData} size={155} />
          </div>
          <figcaption className="regen__thumb-label">Before</figcaption>
        </figure>
        <figure className="regen__thumb">
          <div className="regen__thumb-box regen__thumb-box--after">
            <ConstellationThumb data={afterData} size={155} />
          </div>
          <figcaption className="regen__thumb-label">After</figcaption>
        </figure>
      </div>

      {/* 큰 미리보기 (현재 after) */}
      <div className="regen__preview">
        <ConstellationThumb data={afterData} size={251} />
      </div>

      {/* 다시 생성하기 */}
      <button
        className="regen__regenerate-btn"
        onClick={handleRegenerate}
        disabled={loading}
      >
        {loading ? '생성 중...' : '다시 생성하기'}
      </button>

      {/* 이 디자인으로 결정하기 → 이름 수정 화면으로 */}
      <button
        className="regen__confirm-btn"
        onClick={() => navigate('/engraving/naming')}
      >
        이 디자인으로 결정하기
      </button>
    </div>
  )
}

export default EngravingRegenerate
