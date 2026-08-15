import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import chessBoardPattern from '../assets/chess_board_pattern.svg'
import knightBoardIcon from '../assets/knight_board_icon.svg'
import { gameStatus } from '../data/gameData.js'
import '../styles/GameBoard.css'

function GameHome() {
  const [mode, setMode] = useState('easy')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const handleStartGame = async () => {
    if (starting) return
    setStarting(true)
    setError(null)

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      if (!res.ok) throw new Error('게임을 시작하지 못했습니다')
      const { data } = await res.json()

      navigate(`/game/board/${data.gameSessionId}`, { state: { mode } })
    } catch (e) {
      setError('게임을 시작하지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setStarting(false)
    }
  }
  
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

      {gameStatus.hasPlayed && (
        <div className="recent-result-box">
          <h3 className="recent-result-title">최근 게임 결과</h3>
          <div className="recent-result-row">
            <span>최고 포인트</span>
            <span>{gameStatus.bestScore} pt</span>
          </div>
          <div className="recent-result-row">
            <span>남은 포인트</span>
            <span>{gameStatus.remainingScore} pt</span>
          </div>
          <div className="recent-result-row">
            <span>플레이 횟수</span>
            <span>{gameStatus.playCount} 회</span>
          </div>
        </div>
      )}

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

      {error && <p className="game-home-error">{error}</p>}

      <button
        className="game-cta-button game-cta-button--red"
        onClick={handleStartGame}
        disabled={starting}
      >
        {starting ? '시작하는 중...' : '게임 시작'}
      </button>
    </div>
  )
}

export default GameHome