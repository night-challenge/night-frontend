import { useEffect, useMemo, useState } from 'react'
import ConstellationThumb from '../components/ConstellationThumb'
import { buildConstellation } from '../data/gameTrajectory'
import { mockGameSession } from '../data/gameSessionMock'
import '../styles/GameSessionDetail.css'

// -----------------------------------------------------------------------
// TODO(백엔드 연동 시): 아래 fetchGameSession을 실제 API 호출로 교체
//   GET /api/games/{gameSessionId}
// 지금은 백엔드가 아직 없어서 mockGameSession으로 대체합니다.
// -----------------------------------------------------------------------
async function fetchGameSession(gameSessionId) {
  // const res = await fetch(`/api/games/${gameSessionId}`)
  // if (!res.ok) throw new Error('게임 세션을 불러오지 못했습니다')
  // const { data } = await res.json()
  // return data

  return mockGameSession(gameSessionId)
}

const STATUS_LABEL = {
  WON: '승리',
  LOST: '패배',
  IN_PROGRESS: '진행중',
}

export default function GameSessionDetail({ gameSessionId, onBack, onFinish }) {
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('loading') // loading | error | ready

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

  // 세션이 바뀔 때만 별자리 좌표/연결을 다시 계산
  const constellation = useMemo(() => {
    if (!session) return null
    return buildConstellation(session.knightMoveLog)
  }, [session])

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
        <ConstellationThumb data={constellation} size={300} />
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

      <button className="gsd-cta" onClick={onFinish}>
        게임 마무리 하기
      </button>
    </div>
  )
}