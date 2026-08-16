import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConstellationThumb from '../components/ConstellationThumb'
import { buildGroupsFromMoveLog } from '../data/gameTrajectory'
import { mockGameSession } from '../data/gameSessionMock'
import '../styles/GameSessionDetail.css'
import { gameApi } from '../api/game'

async function fetchGameSession(gameSessionId) {
  const res = await gameApi.get(gameSessionId)
  return res.data.data
}

async function createEngraving(gameSessionId) {
  const res = await gameApi.createEngraving(gameSessionId)
  return res.data.data
}


const STATUS_LABEL = {
  WON: '승리',
  LOST: '패배',
  IN_PROGRESS: '진행중',
}

export default function GameSessionDetail() {
  const { gameSessionId } = useParams()
  const navigate = useNavigate()
  const onBack = () => navigate(-1)

  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('loading') // loading | error | ready

  const [finishing, setFinishing] = useState(false)
  const [finishError, setFinishError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetchGameSession(gameSessionId)
      .then((data) => {
        if (!cancelled) {
          setSession(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [gameSessionId])

  // 세션이 바뀔 때만 그룹(체인)을 다시 계산
  const trajectoryGroups = useMemo(() => {
    if (!session) return []
    return buildGroupsFromMoveLog(session.knightMoveLog)
  }, [session])

  const onFinish = async () => {
    if (finishing) return
    setFinishing(true)
    setFinishError(null)

    try {
      const engraving = await createEngraving(gameSessionId)
      navigate(`/engraving/regenerate/${engraving.id}`)
    } catch (e) {
      setFinishError('각인 저장에 실패했어요. 다시 시도해주세요.')
      setFinishing(false)
    }
  }

  if (status === 'loading') {
    return <div className="gsd-state">불러오는 중...</div>
  }

  if (status === 'error' || !session) {
    return <div className="gsd-state">게임 세션을 불러오지 못했어요.</div>
  }

  return (
    <div className="gsd-page">
      <header className="gsd-header">
        <button className="gsd-back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <h1 className="gsd-title">나이트 챌린지 게임</h1>
        <span className="gsd-header-spacer" />
      </header>

      <div className="gsd-board-wrap">
        <ConstellationThumb data={trajectoryGroups} size={300} />
      </div>

      <section className="gsd-result">
        <h2 className="gsd-result-title">게임 종료</h2>

        <dl className="gsd-stat-list">
          <div className="gsd-stat-row">
            <dt>최종 결과</dt>
            <dd>{STATUS_LABEL[session.status] ?? session.status}</dd>
          </div>
          <div className="gsd-stat-row">
            <dt>이동 횟수</dt>
            <dd>{session.currentTurn}회</dd>
          </div>
          <div className="gsd-stat-row">
            <dt>획득한 포인트</dt>
            <dd>{session.score}pt</dd>
          </div>
        </dl>
      </section>

      {finishError && <p className="gsd-error">{finishError}</p>}

      <button className="gsd-cta" onClick={onFinish} disabled={finishing}>
        {finishing ? '저장하는 중...' : '게임 마무리 하기'}
      </button>
    </div>
  )
}