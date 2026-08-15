// gameSessionMock.js
// GET /api/games/{gameSessionId} 응답(data)을 흉내낸 mock.
// 실제 mockData.js / gameData.js 쪽으로 옮겨서 합쳐도 됩니다.

const KNIGHT_DELTAS = [
  [1, 2], [2, 1], [-1, 2], [-2, 1],
  [1, -2], [2, -1], [-1, -2], [-2, -1],
]
const inBounds = (v) => v >= 0 && v <= 7

// 유효한 나이트 이동(L자)만 골라 랜덤 경로를 만드는 mock 생성기.
// count번 이동하는 하나의 "체인"을 만들어서 반환.
function randomKnightChain(startX, startY, count, startTurn) {
  let x = startX
  let y = startY
  const moves = []

  for (let i = 0; i < count; i++) {
    const candidates = KNIGHT_DELTAS
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => inBounds(nx) && inBounds(ny))

    const [nx, ny] = candidates[Math.floor(Math.random() * candidates.length)]
    moves.push({ turn: startTurn + i, fromX: x, fromY: y, toX: nx, toY: ny })
    x = nx
    y = ny
  }

  return moves
}

export function mockGameSession(gameSessionId) {
  // 스크린샷처럼 두 개의 체인(B1에서 3수, G1에서 4수)으로 구성 — 중간에
  // fromX/fromY가 직전 toX/toY와 이어지지 않아서 ConstellationThumb에서
  // 자연스럽게 2개 그룹으로 나뉘어 그려집니다.
  const chain1 = randomKnightChain(1, 0, 3, 1) // B1 = (file B=1, rank1=0)
  const chain2 = randomKnightChain(6, 0, 4, 4) // G1 = (file G=6, rank1=0)
  const knightMoveLog = [...chain1, ...chain2]

  return {
    id: gameSessionId,
    mode: 'EASY',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    currentTurn: knightMoveLog.length,
    score: 150,
    targetScore: 150,
    status: 'WON', // IN_PROGRESS | WON | LOST
    knightMoveLog,
  }
}