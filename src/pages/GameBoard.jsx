import { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import GameResultOverlay from '../components/GameResultOverlay.jsx'
import { parseFen } from '../data/fen.js'
import { gameApi } from '../api/game'

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
const MAX_TURN = 15

// 캡처된 기물 코드를 한글로 표시하기 위한 매핑 (userMove.captured 값)
const PIECE_LABEL_KO = {
  PAWN: '폰',
  KNIGHT: '나이트',
  BISHOP: '비숍',
  ROOK: '룩',
  QUEEN: '퀸',
}

function coordToSquare(row, col) {
  return `${FILES[col]}${8 - row}`
}

// 서버의 status(IN_PROGRESS / WON / LOST) -> 화면 표시용 값으로 변환
function mapStatusToResult(status) {
  if (status === 'WON') return 'win'
  if (status === 'LOST') return 'lose'
  return null
}

// 백엔드는 '유저 이동 1회 + AI 이동 1회'를 한 세트로 묶어 currentTurn을 1씩 증가시킨다.
// 따라서 별도 변환 없이 그대로 표시하면 된다.

function GameBoard() {
  const { gameSessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // 게임 시작 화면(2)에서 POST /api/games 응답을 통째로 넘겨줬다면 그것을 초기값으로 사용,
  // 없으면(새로고침, 뒤로가기 후 재진입 등) 마운트 시 서버에서 다시 받아온다.
  const initialGameState = location.state?.gameState ?? null

  const [gameState, setGameState] = useState(initialGameState)
  const [board, setBoard] = useState(() =>
    initialGameState ? parseFen(initialGameState.fen) : null
  )
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [legalMovesError, setLegalMovesError] = useState(false) // 추가
  const [targetSquare, setTargetSquare] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastMoveMsg, setLastMoveMsg] = useState(null)

  // 게임 세션 상태 동기화 (최초 진입 및 재진입 시)
  const syncGameState = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await gameApi.get(gameSessionId)
      const game = res.data.data
      setGameState(game)
      setBoard(parseFen(game.fen))
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message ?? '게임 정보를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [gameSessionId])

  useEffect(() => {
      syncGameState()
    }, [syncGameState])

  const fetchLegalMoves = useCallback(async (square) => {
    try {
      const res = await gameApi.legalMoves(gameSessionId, square)
      return res.data.data?.legalMoves ?? res.data.legalMoves ?? []
    } catch (err) {
      console.error(err)
      return null   // ← 실패는 null로 구분
    }
  }, [gameSessionId])

  const handleSquareClick = async (row, col) => {
    if (loading || !gameState || gameState.status !== 'IN_PROGRESS') return
    const square = coordToSquare(row, col)
    const piece = board[row][col]
    console.log('클릭:', square, piece)   //

    if (selectedSquare && legalMoves.includes(square)) {
      setTargetSquare(square)
      return
    }

    if (piece && piece.color === 'white') {
      setSelectedSquare(square)
      setTargetSquare(null)
      setErrorMsg(null)
      setLegalMovesError(false)
      setLegalMoves([])

      const moves = await fetchLegalMoves(square)
      if (moves === null) {
        setLegalMovesError(true)  // 추가
      } else {
        setLegalMoves(moves)
      }
      return
    }

    setSelectedSquare(null)
    setLegalMoves([])
    setTargetSquare(null)
  }

  const handleConfirmMove = async () => {
    if (!selectedSquare || !targetSquare || loading) return
    setLoading(true)
    setErrorMsg(null)
    setLastMoveMsg(null)
    try {
      const res = await gameApi.move(gameSessionId, selectedSquare, targetSquare)
      const { userMove, aiMove, gameState: nextGameState } = res.data.data

      setGameState(nextGameState)
      setBoard(parseFen(nextGameState.fen))

      // 나이트로 캡처해 포인트를 획득했을 때 짧은 안내 메시지 표시
      if (userMove?.pointGained > 0) {
        const label = PIECE_LABEL_KO[userMove.captured] ?? userMove.captured
        setLastMoveMsg(`나이트로 ${label}를 잡아 +${userMove.pointGained}pt 획득!`)
      } else if (userMove?.captured) {
        const label = PIECE_LABEL_KO[userMove.captured] ?? userMove.captured
        setLastMoveMsg(`${label}를 잡았습니다. (포인트 없음)`)
      }
      // aiMove는 게임이 끝나지 않았을 때만 존재. 별도 표시가 필요하면 여기서 활용.
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message ?? '이동을 처리하지 못했습니다.')
    } finally {
      setSelectedSquare(null)
      setLegalMoves([])
      setTargetSquare(null)
      setLoading(false)
    }
  }

  // 진행 중 게임 이탈: 별도 저장 API는 없음 (서버가 매 이동마다 이미 상태를 저장하고 있다고 가정).
  // 홈으로 돌아가면 2.1 화면에서 "진행 중 게임 조회"로 이어서 진행 가능.
  const handleBack = () => {
    navigate('/game/home')
  }

  const handleGoResult = () => {
    navigate(`/game/result/${gameSessionId}`)
  }
  const handleGoHome = () => {
    navigate('/game/home')
  }

  if (!gameState || !board) {
    return (
      <div className="game-board-page">
        <header className="game-board-header">
          <button className="game-board-back" onClick={handleBack} aria-label="뒤로가기">
            ‹
          </button>
          <h1 className="game-board-title">나이트 챌린지 게임</h1>
        </header>
        {errorMsg ? (
          <p className="game-board-error">{errorMsg}</p>
        ) : (
          <p className="game-board-loading">게임 정보를 불러오는 중...</p>
        )}
      </div>
    )
  }

  const gameResult = mapStatusToResult(gameState.status)
  const displayTurn = Math.min(gameState.currentTurn, MAX_TURN)

  return (
    <div className="game-board-page">
      <header className="game-board-header">
        <button className="game-board-back" onClick={handleBack} aria-label="뒤로가기">
          ‹
        </button>
        <h1 className="game-board-title">나이트 챌린지 게임</h1>
      </header>

      <div className="game-board-stats">
        <div className="stat-item">
          <span className="stat-label">현재 턴</span>
          <span className="stat-value">{displayTurn} / {MAX_TURN}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">획득한 포인트</span>
          <span className="stat-value">{gameState.score}pt</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">목표 포인트</span>
          <span className="stat-value">{gameState.targetScore}pt</span>
        </div>
      </div>

      {errorMsg && <p className="game-board-error">{errorMsg}</p>}
      {lastMoveMsg && <p className="game-board-move-msg">{lastMoveMsg}</p>}

      <div className="game-board-wrapper">
        <div className="chess-board">
          {board.map((rowArr, row) =>
            rowArr.map((piece, col) => {
              const square = coordToSquare(row, col)
              const isSelected = selectedSquare === square
              const isLegal = legalMoves.includes(square)
              const isTarget = targetSquare === square
              const isDark = (row + col) % 2 === 0
              const isDimmed = !!selectedSquare && !isSelected && !isLegal && !isTarget
              return (
                <button
                  key={square}
                  className={[
                    'board-square',
                    isDark ? 'board-square--dark' : 'board-square--light',
                    isSelected ? 'board-square--selected' : '',
                    isLegal ? 'board-square--legal' : '',
                    isTarget ? 'board-square--target' : '',
                    isDimmed ? 'board-square--dimmed' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleSquareClick(row, col)}
                  disabled={loading || gameState.status !== 'IN_PROGRESS'}
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
          {!selectedSquare ? (
            <span className="legal-move-chip legal-move-chip--empty">
              말을 선택해주세요
            </span>
          ) : legalMovesError ? (
            <span className="legal-move-chip legal-move-chip--error">
              이동 가능한 칸을 불러오지 못했습니다. 다시 선택해 주세요
            </span>
          ) : legalMoves.length > 0 ? (
            legalMoves.map((sq) => (
              <span key={sq} className="legal-move-chip">{sq}</span>
            ))
          ) : (
            <span className="legal-move-chip legal-move-chip--empty">
              이동 가능한 칸이 없습니다. 다른 말을 선택해 주세요
            </span>
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