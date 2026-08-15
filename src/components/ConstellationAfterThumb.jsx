import '../styles/ConstellationAfterThumb.css'

/**
 * constellationData.after 전용 썸네일.
 * ConstellationThumb(before용, 순서 있는 화살표+시작라벨)과는 데이터 구조가 달라서 별도 컴포넌트로 분리함.
 *
 * data: { points: [{ id, x, y }, ...], connections: [...] }  — 300x300 캔버스 좌표, 순서 없는 그래프
 *
 * ⚠️ connections의 실제 원소 형태를 몰라서 아래 두 가지 형태를 모두 지원하도록 짰음.
 *    실제 API 응답 확인 후 필요없는 쪽은 지워도 됨.
 *    - { from: id, to: id }
 *    - [id, id]
 */
function getConnectionIds(conn) {
  if (Array.isArray(conn)) return [conn[0], conn[1]]
  return [conn.from, conn.to]
}

function ConstellationAfterThumb({ data }) {
  if (!data || !Array.isArray(data.points)) return null

  const { points, connections = [] } = data
  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]))

  return (
    <svg className="constellation-after-thumb" viewBox="0 0 300 300">
      {connections.map((conn, i) => {
        const [fromId, toId] = getConnectionIds(conn)
        const from = pointMap[fromId]
        const to = pointMap[toId]
        if (!from || !to) return null
        return (
          <line
            key={`line-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )
      })}

      {points.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="3" fill="currentColor" />
      ))}
    </svg>
  )
}

export default ConstellationAfterThumb
