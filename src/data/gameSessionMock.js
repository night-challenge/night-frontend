// gameSessionMock.js
// GET /api/games/{gameSessionId} 응답(data)을 흉내낸 mock.
// productAssets/gameData 쪽 파일에 있는 USE_MOCK 패턴과 맞추고 싶으면
// 이 파일 내용을 gameData.js 안으로 옮겨서 합쳐도 됩니다.

const KNIGHT_DELTAS = [
  [1, 2], [2, 1], [-1, 2], [-2, 1],
  [1, -2], [2, -1], [-1, -2], [-2, -1],
]
const inBounds = (v) => v >= 0 && v <= 7

// 유효한 나이트 이동(L자)만 골라 랜덤 경로를 만들어주는 mock 생성기
function generateKnightMoveLog(startX = 1, startY = 2, totalMoves = 15) {
  let x = startX
  let y = startY
  const log = []

  for (let turn = 1; turn <= totalMoves; turn++) {
    const candidates = KNIGHT_DELTAS
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => inBounds(nx) && inBounds(ny))

    const [nx, ny] = candidates[Math.floor(Math.random() * candidates.length)]
    log.push({ turn, fromX: x, fromY: y, toX: nx, toY: ny })
    x = nx
    y = ny
  }

  return log
}

export function mockGameSession(gameSessionId) {
  return {
    id: gameSessionId,
    mode: 'EASY',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    currentTurn: 15,
    score: 150,
    targetScore: 150,
    status: 'WON', // IN_PROGRESS | WON | LOST
    knightMoveLog: generateKnightMoveLog(1, 2, 15),
  }
}