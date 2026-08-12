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

const PIECE_IMAGES = {
  white: { king: wKing, queen: wQueen, rook: wRook, bishop: wBishop, knight: wKnight, pawn: wPawn },
  black: { king: bKing, queen: bQueen, rook: bRook, bishop: bBishop, knight: bKnight, pawn: bPawn },
}

const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

// 표준 체스 초기 배치 (row 0 = 8번 랭크 ~ row 7 = 1번 랭크)
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

// "e2" 같은 표기 <-> {row, col} 변환
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

  // GameHome에서 넘겨준 모드/목표 포인트 (없으면 기본값)
  const mode = location.state?.mode ?? 'easy'
  const targetPoint = mode === 'hard' ? 300 : 150
  const MAX_TURN = 15

  const [board, setBoard] = useState(createInitialBoard)
  const [turn, setTurn] = useState(1)
  const [earnedPoint, setEarnedPoint] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState(null) // "G1" 등
  const [legalMoves, setLegalMoves] = useState([]) // ["F3","H3"] 등
  const [targetSquare, setTargetSquare] = useState(null) // 이동 확정 전, 테두리 표시할 목적지
  const [gameResult, setGameResult] = useState(null) // null | 'win' | 'lose'
  const [loading, setLoading] = useState(false)

  // TODO: 백엔드팀이 준 GET /api/games/{gameSessionId}/legal-moves?square=e2 로 교체
  const fetchLegalMoves = useCallback(async (square) => {
    try {
      const res = await fetch(`/api/games/${gameSessionId}/legal-moves?square=${square}`)
      if (!res.ok) throw new Error('legal-moves 조회 실패')
      const data = await res.json()
      return data.legalMoves ?? [] // 백엔드 응답 형태에 맞춰 수정 필요
    } catch (err) {
      console.error(err)
      return []
    }
  }, [gameSessionId])

  const handleSquareClick = async (row, col) => {
    if (loading || gameResult) return
    const square = coordToSquare(row, col)
    const piece = board[row][col]

    // 케이스 1: 이미 말을 선택한 상태에서, 이동 가능한 칸을 다시 클릭 -> 목적지로 지정
    if (selectedSquare && legalMoves.includes(square)) {
      setTargetSquare(square)
      return
    }

    // 케이스 2: 내 말(white) 클릭 -> 선택 + 이동 가능 칸 조회
    if (piece && piece.color === 'white') {
      setSelectedSquare(square)
      setTargetSquare(null)
      const moves = await fetchLegalMoves(square)
      setLegalMoves(moves)
      return
    }

    // 케이스 3: 그 외 클릭 -> 선택 해제
    setSelectedSquare(null)
    setLegalMoves([])
    setTargetSquare(null)
  }

  const handleConfirmMove = async () => {
    if (!selectedSquare || !targetSquare || loading) return
    setLoading(true)
    try {
      // TODO: 백엔드팀 API 응답 필드명에 맞춰 수정 필요
      const res = await fetch(`/api/games/${gameSessionId}/moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: selectedSquare, to: targetSquare }),
      })
      if (!res.ok) throw new Error('이동 실행 실패')
      const data = await res.json()

      setBoard(data.board ?? board) // 서버가 최신 board 상태를 내려준다고 가정
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

  // 로컬 안전장치: 턴 초과 시 패배 처리 (백엔드가 안 내려줄 경우 대비)
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

  const selectedCoord = selectedSquare ? squareToCoord(selectedSquare) : null
  const targetCoord = targetSquare ? squareToCoord(targetSquare) : null

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
        <div className="chess-board">
          {board.map((rowArr, row) =>
            rowArr.map((piece, col) => {
              const square = coordToSquare(row, col)
              const isDark = (row + col) % 2 === 1
              const isSelected = selectedSquare === square
              const isLegal = legalMoves.includes(square)
              const isTarget = targetSquare === square

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