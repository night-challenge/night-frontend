function GameResultOverlay({ result, onConfirm, onRestart }) {
  const isWin = result === 'win'

  return (
    <div className="game-result-overlay">
      <div className={`result-burst ${isWin ? 'result-burst--win' : 'result-burst--lose'}`}>
        <span className={`result-text ${isWin ? 'result-text--win' : 'result-text--lose'}`}>
          {isWin ? 'WIN!' : 'Lose'}
        </span>
      </div>

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