// FEN(Forsyth-Edwards Notation) 파싱 유틸
// 서버 응답의 fen 필드를 기존 GameBoard의 board[row][col] 형태로 변환한다.
// FEN의 piece placement는 8랭크(흑 백랭크) -> 1랭크(백 백랭크) 순서로 기록되므로
// 결과 board[0]이 8랭크(위쪽, 검정)가 되도록 매핑한다.
// (기존 createInitialBoard()의 board[0] = 검정 백랭크와 좌표계가 동일)
 
const PIECE_TYPE_MAP = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
}
 
/**
 * @param {string} fen - 예: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 * @returns {Array<Array<{type: string, color: 'white'|'black'}|null>>}
 */
export function parseFen(fen) {
  if (!fen || typeof fen !== 'string') {
    throw new Error('유효하지 않은 FEN 문자열입니다.')
  }
 
  const piecePlacement = fen.trim().split(' ')[0]
  const rankRows = piecePlacement.split('/')
 
  if (rankRows.length !== 8) {
    throw new Error('FEN piece placement가 8개 랭크를 포함하지 않습니다.')
  }
 
  const board = rankRows.map((rankStr) => {
    const row = []
    for (const ch of rankStr) {
      if (/\d/.test(ch)) {
        const emptyCount = Number(ch)
        for (let i = 0; i < emptyCount; i++) row.push(null)
      } else {
        const type = PIECE_TYPE_MAP[ch.toLowerCase()]
        if (!type) {
          throw new Error(`알 수 없는 FEN 기물 문자: ${ch}`)
        }
        const color = ch === ch.toUpperCase() ? 'white' : 'black'
        row.push({ type, color })
      }
    }
    if (row.length !== 8) {
      throw new Error(`FEN 랭크의 칸 수가 8이 아닙니다: "${rankStr}"`)
    }
    return row
  })
 
  return board
}
 
/**
 * fen의 active color 필드('w' | 'b')를 반환한다. (필요 시 사용)
 */
export function getFenActiveColor(fen) {
  const parts = fen.trim().split(' ')
  return parts[1] === 'b' ? 'black' : 'white'
}
 