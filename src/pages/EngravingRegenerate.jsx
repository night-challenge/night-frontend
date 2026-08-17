import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { USE_MOCK } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'
import EngravingConstellation from '../components/EngravingConstellation.jsx'
import ConstellationThumb from '../components/ConstellationThumb.jsx'
import { buildBeforeGroups } from '../data/beforeGroups'
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
  const { id } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | success | error
  const [beforeData, setBeforeData] = useState(null)
  const [afterData, setAfterData] = useState(null)
  const [regenLoading, setRegenLoading] = useState(false)

  // 게임에서 새로 생성된 각인 상세 조회: GET /api/engravings/{id}
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
        setBeforeData(data.constellationData.before)
        setAfterData(data.constellationData.after)
        setStatus('success')
      } catch (err) {
        console.error('각인 상세 조회 실패:', err)
        setStatus('error')
      }
    }
    fetchDetail()
  }, [id])

  // 다시 생성하기: PATCH /api/engravings/{id}/regenerate
  const handleRegenerate = async () => {
    setRegenLoading(true)
    try {
      if (USE_MOCK) {
        const newAfter = {
          points: afterData.points,
          connections: randomConnections(afterData.points),
        }
        setAfterData(newAfter)
        // 실제 서버처럼 재생성 결과를 저장해둠 (다음 화면에서 다시 조회해도 유지되도록)
        const target = mockEngravings.find((e) => String(e.id) === String(id))
        if (target) target.constellationData.after = newAfter
      } else {
        const res = await axios.patch(`/api/engravings/${id}/regenerate`)
        // 응답: data.constellationData.after (before는 유지, after만 새로 생성)
        setAfterData(res.data?.data?.constellationData?.after)
      }
    } catch (err) {
      console.error('별자리 재생성 실패:', err)
    } finally {
      setRegenLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="regen">
        <p className="regen__state">불러오는 중...</p>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="regen">
        <p className="regen__state">각인을 불러오지 못했어요.</p>
      </div>
    )
  }

  // Before는 게임 끝나고 나온 화면과 똑같이(체스판 격자 + 이동 화살표) 보여준다.
  // connections 기준으로 나이트별 경로를 분리해서 그룹화(서로 다른 경로끼리 이어지지 않도록).
  const beforeGroups = beforeData?.points
    ? buildBeforeGroups(beforeData.points, beforeData.connections)
    : []

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
            <ConstellationThumb data={beforeGroups} size={155} />
          </div>
          <figcaption className="regen__thumb-label">Before</figcaption>
        </figure>
        <figure className="regen__thumb">
          <div className="regen__thumb-box regen__thumb-box--after">
            <EngravingConstellation data={afterData} space="canvas" size={155} />
          </div>
          <figcaption className="regen__thumb-label">After</figcaption>
        </figure>
      </div>

      {/* 큰 미리보기 (현재 after) */}
      <div className="regen__preview">
        <EngravingConstellation data={afterData} space="canvas" size={251} />
      </div>

      {/* 다시 생성하기 */}
      <button
        className="regen__regenerate-btn"
        onClick={handleRegenerate}
        disabled={regenLoading}
      >
        {regenLoading ? '생성 중...' : '다시 생성하기'}
      </button>

      {/* 이 디자인으로 결정하기 → 이름 수정 화면으로 */}
      <button
        className="regen__confirm-btn"
        onClick={() => navigate(`/engraving/naming/${id}`)}
      >
        이 디자인으로 결정하기
      </button>
    </div>
  )
}

export default EngravingRegenerate
