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

import '../styles/GameBoard.css'

const PIECE_IMAGES = {
  white: {
    king: wKing,
    queen: wQueen,
    rook: wRook,
    bishop: wBishop,
    knight: wKnight,
    pawn: wPawn,
  },

  black: {
    king: bKing,
    queen: bQueen,
    rook: bRook,
    bishop: bBishop,
    knight: bKnight,
    pawn: bPawn,
  },
}

const FILES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
]

const RANKS = [
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
]

const MAX_TURN = 15

// 기물 타입 -> 한글 이름
const PIECE_LABEL_KO = {
  pawn: '폰',
  knight: '나이트',
  bishop: '비숍',
  rook: '룩',
  queen: '퀸',
  king: '킹',

  // captured 값이 대문자로 오는 경우도 처리
  PAWN: '폰',
  KNIGHT: '나이트',
  BISHOP: '비숍',
  ROOK: '룩',
  QUEEN: '퀸',
  KING: '킹',
}

// 기물 타입을 한글 이름으로 변환
function getPieceLabel(type) {
  if (!type) return '기물'

  return (
    PIECE_LABEL_KO[type] ??
    PIECE_LABEL_KO[String(type).toLowerCase()] ??
    type
  )
}

function getSubjectParticle(word) {
  const lastChar = word[word.length - 1]
  const code =
    lastChar.charCodeAt(0) - 0xac00

  return code % 28 === 0 ? '가' : '이'
}

function coordToSquare(row, col) {
  return `${FILES[col]}${8 - row}`
}

// 백엔드 status
// IN_PROGRESS / WON / LOST
//
// 화면 표시용
// win / lose
function mapStatusToResult(status) {
  if (status === 'WON') return 'win'
  if (status === 'LOST') return 'lose'

  return null
}

// 게임이 종료되었으면 localStorage의 세션 ID 삭제
function clearSavedGameSession() {
  localStorage.removeItem('gameSessionId')
}

function GameBoard() {
  const { gameSessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // 게임 시작 화면에서 POST /api/games 응답을 통째로 넘겨줬다면
  // 그것을 초기값으로 사용
  const initialGameState =
    location.state?.gameState ?? null

  const [gameState, setGameState] =
    useState(initialGameState)

  const [board, setBoard] = useState(() =>
    initialGameState
      ? parseFen(initialGameState.fen)
      : null
  )

  // 현재 선택한 칸
  const [selectedSquare, setSelectedSquare] =
    useState(null)

  // 현재 선택한 기물의 종류
  const [selectedPieceType, setSelectedPieceType] =
    useState(null)

  // 이동 가능한 칸
  const [legalMoves, setLegalMoves] = useState([])

  const [legalMovesError, setLegalMovesError] =
    useState(false)

  // 이동 목표 칸
  const [targetSquare, setTargetSquare] =
    useState(null)

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastMoveMsg, setLastMoveMsg] = useState(null)

  // 게임 세션 상태 동기화
  const syncGameState = useCallback(
    async () => {
      setLoading(true)
      setErrorMsg(null)

      try {
        const res =
          await gameApi.get(gameSessionId)

        const game = res.data.data

        setGameState(game)
        setBoard(parseFen(game.fen))

        // 혹시 이미 종료된 게임으로 들어온 경우에도
        // localStorage에 남아있는 세션 ID 삭제
        if (
          game.status === 'WON' ||
          game.status === 'LOST'
        ) {
          clearSavedGameSession()
        }
      } catch (err) {
        console.error(err)

        setErrorMsg(
          err.message ??
            '게임 정보를 불러오지 못했습니다.'
        )
      } finally {
        setLoading(false)
      }
    },
    [gameSessionId]
  )

  useEffect(() => {
    syncGameState()
  }, [syncGameState])

  // 특정 칸의 이동 가능한 칸 조회
  const fetchLegalMoves = useCallback(
    async (square) => {
      try {
        const res =
          await gameApi.legalMoves(
            gameSessionId,
            square
          )

        return (
          res.data.data?.legalMoves ??
          res.data.legalMoves ??
          []
        )
      } catch (err) {
        console.error(err)
        return null
      }
    },
    [gameSessionId]
  )

  // 보드 칸 클릭
  const handleSquareClick = async (
    row,
    col
  ) => {
    if (
      loading ||
      !gameState ||
      gameState.status !== 'IN_PROGRESS'
    ) {
      return
    }

    const square =
      coordToSquare(row, col)

    const piece = board[row][col]

    console.log('클릭:', square, piece)

    // 이미 기물을 선택한 상태에서
    // 이동 가능한 칸을 클릭한 경우
    if (
      selectedSquare &&
      legalMoves.includes(square)
    ) {
      setTargetSquare(square)
      return
    }

    // 백색 기물을 선택한 경우
    if (
      piece &&
      piece.color === 'white'
    ) {
      setSelectedSquare(square)

      // 선택한 기물의 실제 타입 저장
      setSelectedPieceType(piece.type)

      setTargetSquare(null)
      setErrorMsg(null)
      setLegalMovesError(false)
      setLegalMoves([])

      const moves =
        await fetchLegalMoves(square)

      if (moves === null) {
        setLegalMovesError(true)
      } else {
        setLegalMoves(moves)
      }

      return
    }

    // 아무 기물도 선택하지 않은 경우
    setSelectedSquare(null)
    setSelectedPieceType(null)
    setLegalMoves([])
    setTargetSquare(null)
  }

  // 이동 확정
  const handleConfirmMove = async () => {
    if (
      !selectedSquare ||
      !targetSquare ||
      loading
    ) {
      return
    }

    setLoading(true)
    setErrorMsg(null)
    setLastMoveMsg(null)

    try {
      const res =
        await gameApi.move(
          gameSessionId,
          selectedSquare,
          targetSquare
        )

      const {
        userMove,
        aiMove,
        gameState: nextGameState,
      } = res.data.data

      setGameState(nextGameState)
      setBoard(
        parseFen(nextGameState.fen)
      )

      // ⭐ 게임 종료 여부 확인
      // 승리 또는 패배하면 저장된 게임 ID 삭제
      if (
        nextGameState.status === 'WON' ||
        nextGameState.status === 'LOST'
      ) {
        clearSavedGameSession()
      }

      // 실제로 이동한 기물 이름
      const movedPieceType =
        userMove?.piece ??
        userMove?.movedPiece ??
        selectedPieceType

      const movedPieceLabel =
        getPieceLabel(movedPieceType)

      // 포인트 획득
      if (
        userMove?.pointGained > 0
      ) {
        const label =
          getPieceLabel(
            userMove.captured
          )

        setLastMoveMsg(
          `${movedPieceLabel}로 ${label}를 잡아 +${userMove.pointGained}pt 획득!`
        )
      }

      // 캡처했지만 포인트가 없는 경우
      else if (userMove?.captured) {
        const label =
          getPieceLabel(
            userMove.captured
          )

        setLastMoveMsg(
          `${movedPieceLabel}로 ${label}를 잡았습니다. (포인트 없음)`
        )
      }

      // aiMove는 게임이 끝나지 않았을 때만 존재
      // 별도 표시가 필요하면 여기서 활용
    } catch (err) {
      console.error(err)

      setErrorMsg(
        err.message ??
          '이동을 처리하지 못했습니다.'
      )
    } finally {
      setSelectedSquare(null)
      setSelectedPieceType(null)
      setLegalMoves([])
      setTargetSquare(null)
      setLoading(false)
    }
  }

  // 게임 이탈
  const handleBack = () => {
    navigate('/game/home')
  }

  // 결과 화면
  const handleGoResult = () => {
    navigate(
      `/game/result/${gameSessionId}`
    )
  }

  // 홈
  const handleGoHome = () => {
    navigate('/game/home')
  }

  // 게임 정보 로딩 전
  if (!gameState || !board) {
    return (
      <div className="game-board-page">
        <header className="game-board-header">
          <button
            className="game-board-back"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <h1 className="game-board-title">
            나이트 챌린지 게임
          </h1>
        </header>

        {errorMsg ? (
          <p className="game-board-error">
            {errorMsg}
          </p>
        ) : (
          <p className="game-board-loading">
            게임 정보를 불러오는 중...
          </p>
        )}
      </div>
    )
  }

  const gameResult =
    mapStatusToResult(
      gameState.status
    )

  const displayTurn = Math.min(
    gameState.currentTurn,
    MAX_TURN
  )

  // 현재 선택한 기물의 한글 이름
  const selectedPieceLabel =
    getPieceLabel(
      selectedPieceType
    )

  return (
    <div className="game-board-page">
      <header className="game-board-header">
        <button
          className="game-board-back"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1 className="game-board-title">
          나이트 챌린지 게임
        </h1>
      </header>

      <div className="game-board-stats">
        <div className="stat-item">
          <span className="stat-label">
            현재 턴
          </span>

          <span className="stat-value">
            {displayTurn} / {MAX_TURN}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">
            획득한 포인트
          </span>

          <span className="stat-value">
            {gameState.score}pt
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">
            목표 포인트
          </span>

          <span className="stat-value">
            {gameState.targetScore}pt
          </span>
        </div>
      </div>

      {errorMsg && (
        <p className="game-board-error">
          {errorMsg}
        </p>
      )}

      {lastMoveMsg && (
        <p className="game-board-move-msg">
          {lastMoveMsg}
        </p>
      )}

      <div className="game-board-wrapper">
        <div className="board-ranks">
          {RANKS.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>

        <div className="board-main">
          <div className="chess-board">
            {board.map((rowArr, row) =>
              rowArr.map((piece, col) => {
                const square =
                  coordToSquare(row, col)

                const isSelected =
                  selectedSquare === square

                const isLegal =
                  legalMoves.includes(
                    square
                  )

                const isTarget =
                  targetSquare === square

                const isDark =
                  (row + col) % 2 === 0

                const isDimmed =
                  !!selectedSquare &&
                  !isSelected &&
                  !isLegal &&
                  !isTarget

                return (
                  <button
                    key={square}
                    className={[
                      'board-square',
                      isDark
                        ? 'board-square--dark'
                        : 'board-square--light',
                      isSelected
                        ? 'board-square--selected'
                        : '',
                      isLegal
                        ? 'board-square--legal'
                        : '',
                      isTarget
                        ? 'board-square--target'
                        : '',
                      isDimmed
                        ? 'board-square--dimmed'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() =>
                      handleSquareClick(
                        row,
                        col
                      )
                    }
                    disabled={
                      loading ||
                      gameState.status !==
                        'IN_PROGRESS'
                    }
                  >
                    {piece && (
                      <img
                        src={
                          PIECE_IMAGES[
                            piece.color
                          ][piece.type]
                        }
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
      </div>

      <div className="legal-moves-box">
        <p className="legal-moves-title">
          {selectedSquare
            ? `${selectedPieceLabel}${getSubjectParticle(
                selectedPieceLabel
              )} 이동 가능한 칸`
            : '이동 가능한 칸'}
        </p>

        <div className="legal-moves-chips">
          {!selectedSquare ? (
            <span className="legal-move-chip legal-move-chip--empty">
              말을 선택해주세요
            </span>
          ) : legalMovesError ? (
            <span className="legal-move-chip legal-move-chip--error">
              이동 가능한 칸을 불러오지 못했습니다.
              다시 선택해 주세요
            </span>
          ) : legalMoves.length > 0 ? (
            legalMoves.map((sq) => (
              <span
                key={sq}
                className="legal-move-chip"
              >
                {sq}
              </span>
            ))
          ) : (
            <span className="legal-move-chip legal-move-chip--empty">
              이동 가능한 칸이 없습니다.
              다른 말을 선택해 주세요
            </span>
          )}
        </div>
      </div>

      <button
        className="game-cta-button game-confirm-button"
        disabled={
          !targetSquare ||
          loading
        }
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