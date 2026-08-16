import { gameApi } from '../api/game'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import chessBoardPattern from '../assets/chess_board_pattern.svg'
import knightBoardIcon from '../assets/knight_board_icon.svg'
import '../styles/GameBoard.css'

function GameHome() {
  const [mode, setMode] = useState('easy')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // 최근 게임 통계 (최고 포인트 / 플레이 횟수)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // 진행 중인 게임 여부
  const [activeGame, setActiveGame] = useState(null)
  const [checkingActive, setCheckingActive] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const res = await gameApi.getStats()
        if (!cancelled) setStats(res.data.data)
      } catch (e) {
        console.error(e)
        if (!cancelled) setStats(null)
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    }

    const fetchActiveGame = async () => {
      setCheckingActive(true)
      try {
        const res = await gameApi.getActive()
        if (!cancelled) setActiveGame(res.data.data)
      } catch (e) {
        // 404 = 진행 중인 게임 없음 (정상 케이스, 에러 아님)
        // 주의: api/index.js 인터셉터가 axios 에러를 새 Error로 감싸면서
        // err.status에 원본 HTTP status를 실어 보냄 (e.response는 없음)
        if (e.status === 404) {
          if (!cancelled) setActiveGame(null)
        } else {
          console.error(e)
          if (!cancelled) setActiveGame(null)
        }
      } finally {
        if (!cancelled) setCheckingActive(false)
      }
    }

    fetchStats()
    fetchActiveGame()
    return () => {
      cancelled = true
    }
  }, [])

  const handleStartGame = async () => {
    if (starting) return
    setStarting(true)
    setError(null)

    try {
      const res = await gameApi.start(mode)
      const game = res.data.data
      navigate(`/game/board/${game.id}`, {
        state: { gameState: game, mode },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setStarting(false)
    }
  }

  const handleResumeGame = () => {
    if (!activeGame) return
    navigate(`/game/board/${activeGame.id}`, {
      state: { gameState: activeGame },
    })
  }

  const hasPlayed = !statsLoading && stats && stats.playCount > 0

  return (
    <div className="game-home">
      <img src={chessBoardPattern} alt="체스판 패턴" className="game-home-board-banner" />

      <h2 className="game-home-title">나이트 챌린지</h2>

      <p className="game-home-desc">
        나이트를 움직여 기물을 잡고 포인트를 모아보세요!
        <br />
        목표 포인트를 달성하면 게임 종료.
      </p>
      <p className="game-home-desc">
        당신이 그린 나이트의 움직임은 AI가 다듬어
        <br />
        세상에 하나뿐인 각인으로 재탄생합니다.
      </p>

      <div className="how-to-box">
        <h3 className="how-to-title">플레이 방식</h3>
        <ol className="how-to-list">
          <li>체스 이동 규칙으로 보드를 누빈다.</li>
          <li>나이트로 움직여 기물을 잡으면 포인트를 획득한다.</li>
          <li>턴 안에 목표 포인트를 모으면 게임이 종료된다.</li>
        </ol>
      </div>

      <div className="knight-preview-box">
        <img src={knightBoardIcon} alt="나이트 이동 예시" className="knight-preview-image" />
        <p className="knight-preview-caption">
          나이트는 L자 모양으로 이동하며,
          <br />
          다른 기물을 뛰어넘을 수 있는 독특한 기물입니다.
        </p>
      </div>

      {hasPlayed && (
        <div className="recent-result-box">
          <h3 className="recent-result-title">최근 게임 결과</h3>
          <div className="recent-result-row">
            <span>최고 포인트</span>
            <span>{stats.bestScore} pt</span>
          </div>
          <div className="recent-result-row">
            <span>플레이 횟수</span>
            <span>{stats.playCount} 회</span>
          </div>
        </div>
      )}

      {error && <p className="game-home-error">{error}</p>}

      {checkingActive ? (
        <button className="game-cta-button game-cta-button--red" disabled>
          확인 중...
        </button>
      ) : activeGame ? (
        // 진행 중인 게임이 있으면 모드 선택 없이 바로 이어하기만 노출
        <>
          <div className="recent-result-box">
            <h3 className="recent-result-title">진행 중인 게임이 있어요</h3>
            <div className="recent-result-row">
              <span>현재 턴</span>
              <span>{activeGame.currentTurn} / 15</span>
            </div>
            <div className="recent-result-row">
              <span>획득한 포인트</span>
              <span>{activeGame.score}pt</span>
            </div>
          </div>
          <button className="game-cta-button game-cta-button--red" onClick={handleResumeGame}>
            이어하기
          </button>
        </>
      ) : (
        // 진행 중인 게임이 없으면 기존처럼 모드 선택 후 새 게임 시작
        <>
          <h3 className="mode-select-title">모드 선택</h3>
          <div className="mode-select-buttons">
            <button
              className={`mode-button${mode === 'easy' ? ' mode-button--active' : ''}`}
              onClick={() => setMode('easy')}
            >
              easy
            </button>
            <button
              className={`mode-button${mode === 'hard' ? ' mode-button--active' : ''}`}
              onClick={() => setMode('hard')}
            >
              hard
            </button>
          </div>

          <button
            className="game-cta-button game-cta-button--red"
            onClick={handleStartGame}
            disabled={starting}
          >
            {starting ? '시작하는 중...' : '게임 시작'}
          </button>
        </>
      )}
    </div>
  )
}

export default GameHome