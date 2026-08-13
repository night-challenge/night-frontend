import { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import GameResultOverlay from '../components/GameResultOverlay.jsx'

// 기물 이미지 불러오기
import wKing from '../assets/pieces/piece_white_king.svg'
import wQueen from '../assets/pieces/piece_white_queen.svg'
import wRook from '../assets/pieces/piece_white_rook.svg'
import wBishop from '../assets/pieces/piece_white_bishop.svg'
import wKnight from '../assets/pieces/piece_white_knight.svg'
import wPawn from '../assets/pieces/piece_white_pawn.svg'
import bKing from '../assets/pieces/piece_black_king.svg'
import bQueen from '../assets/pieces/piece_black_queen.svg'
import bRook from '../assets/pieces/piece_black_rook.svg'
import bBishop from '../assets/pieces/piece_black_bishop.svg'
import bKnight from '../assets/pieces/piece_black_knight.svg'
import bPawn from '../assets/pieces/piece_black_pawn.svg'
// boardBg 이미지는 더 이상 필요 없음 (CSS로 직접 그림)

const PIECE_IMAGES = {
  white: { king: wKing, queen: wQueen, rook: wRook, bishop: wBishop, knight: wKnight, pawn: wPawn },
  black: { king: bKing, queen: bQueen, rook: bRook, bishop: bBishop, knight: bKnight, pawn: bPawn },
}

const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function createInitialBoard() {
  const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))

  backRank.forEach((type, col) => {
    board[0][col] = { type, color: 'black' }
    board[7][col] = { type, color: 'white' }
  })
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' }
    board[6][col] = { type: 'pawn', color: 'white' }
  }
  return board
}

function squareToCoord(square) {
  const col = FILES.indexOf(square[0].toUpperCase())
  const row = 8 - Number(square[1])
  return { row, col }
}
function coordToSquare(row, col) {
  return `${FILES[col]}${8 - row}`
}

function GameBoard() {
  const { gameSessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const mode = location.state?.mode ?? 'easy'
  const targetPoint = mode === 'hard' ? 300 : 150
  const MAX_TURN = 15

  const [board, setBoard] = useState(createInitialBoard)
  const [turn, setTurn] = useState(1)
  const [earnedPoint, setEarnedPoint] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [targetSquare, setTargetSquare] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchLegalMoves = useCallback(async (square) => {
    try {
      const res = await fetch(`/api/games/${gameSessionId}/legal-moves?square=${square}`)
      if (!res.ok) throw new Error('legal-moves 조회 실패')
      const data = await res.json()
      return data.legalMoves ?? []
    } catch (err) {
      console.error(err)
      return []
    }
  }, [gameSessionId])

  const handleSquareClick = async (row, col) => {
    if (loading || gameResult) return
    const square = coordToSquare(row, col)
    const piece = board[row][col]

    if (selectedSquare && legalMoves.includes(square)) {
      setTargetSquare(square)
      return
    }

    if (piece && piece.color === 'white') {
      setSelectedSquare(square)
      setTargetSquare(null)
      const moves = await fetchLegalMoves(square)
      setLegalMoves(moves)
      return
    }

    setSelectedSquare(null)
    setLegalMoves([])
    setTargetSquare(null)
  }

  const handleConfirmMove = async () => {
    if (!selectedSquare || !targetSquare || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameSessionId}/moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: selectedSquare, to: targetSquare }),
      })
      if (!res.ok) throw new Error('이동 실행 실패')
      const data = await res.json()

      setBoard(data.board ?? board)
      setTurn((prev) => data.turn ?? prev + 1)
      setEarnedPoint(data.earnedPoint ?? earnedPoint)

      if (data.status === 'WIN') setGameResult('win')
      else if (data.status === 'LOSE') setGameResult('lose')
    } catch (err) {
      console.error(err)
    } finally {
      setSelectedSquare(null)
      setLegalMoves([])
      setTargetSquare(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (gameResult) return
    if (turn > MAX_TURN) setGameResult('lose')
    else if (earnedPoint >= targetPoint) setGameResult('win')
  }, [turn, earnedPoint, targetPoint, gameResult])

  const handleGoResult = () => {
    navigate(`/game/result/${gameSessionId}`)
  }
  const handleGoHome = () => {
    navigate('/game/home')
  }

  return (
    <div className="game-board-page">
      <header className="game-board-header">
        <button className="game-board-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          ‹
        </button>
        <h1 className="game-board-title">나이트 챌린지 게임</h1>
      </header>

      <div className="game-board-stats">
        <div className="stat-item">
          <span className="stat-label">현재 턴</span>
          <span className="stat-value">{turn} / {MAX_TURN}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">획득한 포인트</span>
          <span className="stat-value">{earnedPoint}pt</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">목표 포인트</span>
          <span className="stat-value">{targetPoint}pt</span>
        </div>
      </div>

      <div className="game-board-wrapper">
        {/* 이미지 대신 순수 CSS grid + 배경색으로 체스판을 그림 */}
        <div className="chess-board">
          {board.map((rowArr, row) =>
            rowArr.map((piece, col) => {
              const square = coordToSquare(row, col)
              const isSelected = selectedSquare === square
              const isLegal = legalMoves.includes(square)
              const isTarget = targetSquare === square
              const isDark = (row + col) % 2 === 0 // svg 기준: 짝수합 = 진한색(#FC594A)

              return (
                <button
                  key={square}
                  className={[
                    'board-square',
                    isDark ? 'board-square--dark' : 'board-square--light',
                    isSelected ? 'board-square--selected' : '',
                    isLegal ? 'board-square--legal' : '',
                    isTarget ? 'board-square--target' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleSquareClick(row, col)}
                >
                  {piece && (
                    <img
                      src={PIECE_IMAGES[piece.color][piece.type]}
                      alt={`${piece.color} ${piece.type}`}
                      className="board-piece"
                    />
                  )}
                </button>
              )
            })
          )}
        </div>
        <div className="board-files">
          {FILES.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>

      <div className="legal-moves-box">
        <p className="legal-moves-title">나이트가 이동 가능한 칸</p>
        <div className="legal-moves-chips">
          {legalMoves.length > 0 ? (
            legalMoves.map((sq) => (
              <span key={sq} className="legal-move-chip">{sq}</span>
            ))
          ) : (
            <span className="legal-move-chip legal-move-chip--empty">말을 선택해주세요</span>
          )}
        </div>
      </div>

      <button
        className="game-cta-button game-confirm-button"
        disabled={!targetSquare || loading}
        onClick={handleConfirmMove}
      >
        이동 확정
      </button>

      {gameResult && (
        <GameResultOverlay
          result={gameResult}
          onConfirm={handleGoResult}
          onRestart={handleGoHome}
        />
      )}
    </div>
  )
}

export default GameBoard