// gameTrajectory.js
// knightMoveLog(턴별 fromX/fromY -> toX/toY)를 ConstellationThumb이 바로 그릴 수 있는
// 모양으로 변환합니다.
//
// ConstellationThumb이 기대하는 data:
//   [
//     { points: [{x,y}, {x,y}, ...] }, // 그룹1 (이동 순서대로, 격자좌표 0~7)
//     { points: [{x,y}, {x,y}, ...] }, // 그룹2
//   ]
//
// "그룹"을 나누는 기준: 이번 이동의 출발 칸(fromX,fromY)이 직전 이동의
// 도착 칸(toX,toY)과 다르면 나이트가 리셋/재배치된 것으로 보고 새 그룹을 시작합니다.
// (스크린샷의 "B1 start, 3 moves" / "G1 start, 4 moves"가 바로 이 그룹 2개였어요.)
export function buildGroupsFromMoveLog(knightMoveLog) {
  if (!knightMoveLog || knightMoveLog.length === 0) return []

  const groups = []
  let current = null

  for (const move of knightMoveLog) {
    const sameChain =
      current &&
      current.points[current.points.length - 1].x === move.fromX &&
      current.points[current.points.length - 1].y === move.fromY

    if (sameChain) {
      current.points.push({ x: move.toX, y: move.toY })
    } else {
      current = {
        points: [
          { x: move.fromX, y: move.fromY },
          { x: move.toX, y: move.toY },
        ],
      }
      groups.push(current)
    }
  }

  return groups
}