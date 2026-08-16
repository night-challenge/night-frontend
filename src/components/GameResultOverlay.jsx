import winBadge from '../assets/result/win.svg'
import loseBadge from '../assets/result/lose.svg'
import '../styles/GameResultOverlay.css'

function GameResultOverlay({ result, onConfirm, onRestart }) {
  const isWin = result === 'win'

  return (
    <div className="game-result-overlay">
      <img
        src={isWin ? winBadge : loseBadge}
        alt={isWin ? '승리' : '패배'}
        className={`result-badge ${isWin ? 'result-badge--win' : 'result-badge--lose'}`}
      />

      <button
        className={`game-cta-button ${isWin ? 'game-cta-button--red' : ''}`}
        onClick={isWin ? onConfirm : onRestart}
      >
        {isWin ? '게임 결과 확인하기' : '처음 화면으로 돌아가기'}
      </button>
    </div>
  )
}

export default GameResultOverlay