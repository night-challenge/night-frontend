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

  // localStorage에 저장된 게임 중 진행 중인 게임
  const [activeGame, setActiveGame] = useState(null)
  const [checkingActive, setCheckingActive] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchStats = async () => {
      setStatsLoading(true)

      try {
        const res = await gameApi.getStats()

        if (!cancelled) {
          setStats(res.data.data)
        }
      } catch (e) {
        console.error(e)

        if (!cancelled) {
          setStats(null)
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false)
        }
      }
    }

    const fetchActiveGame = async () => {
      setCheckingActive(true)

      try {
        // localStorage에 저장된 게임 ID 가져오기
        const savedGameSessionId = localStorage.getItem('gameSessionId')

        // 저장된 게임이 없으면 이어하기 표시하지 않음
        if (!savedGameSessionId) {
          if (!cancelled) {
            setActiveGame(null)
          }
          return
        }

        // 저장된 ID의 게임 상태 조회
        const res = await gameApi.get(savedGameSessionId)
        const game = res.data.data

        if (game.status === 'IN_PROGRESS') {
          // 아직 진행 중이면 이어하기 표시
          if (!cancelled) {
            setActiveGame(game)
          }
        } else {
          // 이미 승리/패배한 게임이면 저장된 ID 삭제
          localStorage.removeItem('gameSessionId')

          if (!cancelled) {
            setActiveGame(null)
          }
        }
      } catch (e) {
        console.error(e)

        // 저장된 게임을 조회할 수 없는 경우
        // 잘못된 ID가 남아있지 않도록 삭제
        localStorage.removeItem('gameSessionId')

        if (!cancelled) {
          setActiveGame(null)
        }
      } finally {
        if (!cancelled) {
          setCheckingActive(false)
        }
      }
    }

    fetchStats()
    fetchActiveGame()

    return () => {
      cancelled = true
    }
  }, [])

  // 새 게임 시작
  const handleStartGame = async () => {
    if (starting) return

    setStarting(true)
    setError(null)

    try {
      const res = await gameApi.start(mode)
      const game = res.data.data

      // 새 게임 세션 ID를 localStorage에 저장
      localStorage.setItem('gameSessionId', game.id)

      navigate(`/game/board/${game.id}`, {
        state: {
          gameState: game,
          mode,
        },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setStarting(false)
    }
  }

  // 진행 중인 게임 이어하기
  const handleResumeGame = () => {
    if (!activeGame) return

    navigate(`/game/board/${activeGame.id}`, {
      state: {
        gameState: activeGame,
      },
    })
  }

  const hasPlayed =
    !statsLoading &&
    stats &&
    stats.playCount > 0

  return (
    <div className="game-home">
      <img
        src={chessBoardPattern}
        alt="체스판 패턴"
        className="game-home-board-banner"
      />

      <h2 className="game-home-title">
        나이트 챌린지
      </h2>

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
        <h3 className="how-to-title">
          플레이 방식
        </h3>

        <ol className="how-to-list">
          <li>
            체스 이동 규칙으로 보드를 누빈다.
          </li>

          <li>
            나이트를 움직여 기물을 잡으면 포인트를 획득한다.
          </li>

          <li>
            턴 안에 목표 포인트를 모으면 게임이 종료된다.
          </li>
        </ol>

        <p className= "caution">
          나이트 외 기물의 이동은 점수 획득 및 궤적 생성에 반영되지 않습니다
        </p>
      </div>

      <div className="knight-preview-box">
        <img
          src={knightBoardIcon}
          alt="나이트 이동 예시"
          className="knight-preview-image"
        />

        <p className="knight-preview-caption">
          나이트는 L자 모양으로 이동하며,
          <br />
          다른 기물을 뛰어넘을 수 있는 독특한 기물입니다.
        </p>
      </div>

      {hasPlayed && (
        <div className="recent-result-box">
          <h3 className="recent-result-title">
            최근 게임 결과
          </h3>

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

      {error && (
        <p className="game-home-error">
          {error}
        </p>
      )}

      {checkingActive ? (
        <button
          className="game-cta-button game-cta-button--red"
          disabled
        >
          확인 중...
        </button>
      ) : activeGame ? (
        <>
          <div className="recent-result-box">
            <h3 className="recent-result-title">
              진행 중인 게임이 있어요
            </h3>

            <div className="recent-result-row">
              <span>현재 턴</span>
              <span>
                {activeGame.currentTurn} / 15
              </span>
            </div>

            <div className="recent-result-row">
              <span>획득한 포인트</span>
              <span>
                {activeGame.score}pt
              </span>
            </div>
          </div>

          <button
            className="game-cta-button game-cta-button--red"
            onClick={handleResumeGame}
          >
            이어하기
          </button>
        </>
      ) : (
        <>
          <h3 className="mode-select-title">
            모드 선택
          </h3>

          <div className="mode-select-buttons">
            <button
              className={`mode-button${
                mode === 'easy'
                  ? ' mode-button--active'
                  : ''
              }`}
              onClick={() => setMode('easy')}
            >
              easy
            </button>

            <button
              className={`mode-button${
                mode === 'hard'
                  ? ' mode-button--active'
                  : ''
              }`}
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
            {starting
              ? '시작하는 중...'
              : '게임 시작'}
          </button>
        </>
      )}
    </div>
  )
}

export default GameHome