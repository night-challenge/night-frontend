// ConstellationThumb.jsx
// 기대하는 data 형태:
// [
//   { points: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }] }, // 그룹1 (이동 순서대로)
//   { points: [{ x: 5, y: 1 }, { x: 4, y: 3 }, { x: 5, y: 5 }, { x: 7, y: 4 }] }, // 그룹2
// ]
// x, y는 0~7 격자 좌표 (x = file 0~7 → A~H, y = rank 0~7 → 1~8)

const GRID_SIZE = 8
const CELL = 32
const MARGIN_LEFT = 26
const MARGIN_TOP = 14
const MARGIN_BOTTOM = 26
const MARGIN_RIGHT = 14

const BOARD_W = MARGIN_LEFT + GRID_SIZE * CELL + MARGIN_RIGHT
const BOARD_H = MARGIN_TOP + GRID_SIZE * CELL + MARGIN_BOTTOM

// 격자좌표 -> 픽셀좌표 (y=0(랭크1)이 맨 아래로 오도록 뒤집음)
function toPixel(x, y) {
  return {
    px: MARGIN_LEFT + x * CELL + CELL / 2,
    py: MARGIN_TOP + (GRID_SIZE - 1 - y) * CELL + CELL / 2,
  }
}

function squareName(x, y) {
  return `${String.fromCharCode(65 + x)}${y + 1}`
}

function ConstellationThumb({ data, size = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="constellation-thumb constellation-thumb--empty"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <svg
      viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
      width={size}
      height={(size * BOARD_H) / BOARD_W}
      className="constellation-thumb"
    >
      <defs>
        <marker
          id="ct-arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* ===== 격자선 ===== */}
      <g className="ct-grid" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={MARGIN_LEFT + i * CELL}
            y1={MARGIN_TOP}
            x2={MARGIN_LEFT + i * CELL}
            y2={MARGIN_TOP + GRID_SIZE * CELL}
          />
        ))}
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={MARGIN_LEFT}
            y1={MARGIN_TOP + i * CELL}
            x2={MARGIN_LEFT + GRID_SIZE * CELL}
            y2={MARGIN_TOP + i * CELL}
          />
        ))}
      </g>

      {/* ===== 축 라벨 (A~H, 1~8) ===== */}
      <g className="ct-axis-labels" fill="currentColor" fontSize="9">
        {Array.from({ length: GRID_SIZE }).map((_, file) => (
          <text
            key={`file-${file}`}
            x={MARGIN_LEFT + file * CELL + CELL / 2}
            y={MARGIN_TOP + GRID_SIZE * CELL + 16}
            textAnchor="middle"
          >
            {String.fromCharCode(65 + file)}
          </text>
        ))}
        {Array.from({ length: GRID_SIZE }).map((_, rankIdx) => (
          <text
            key={`rank-${rankIdx}`}
            x={MARGIN_LEFT - 14}
            y={MARGIN_TOP + (GRID_SIZE - 1 - rankIdx) * CELL + CELL / 2 + 3}
            textAnchor="middle"
          >
            {rankIdx + 1}
          </text>
        ))}
      </g>

      {/* ===== 그룹별 경로(화살표 + 점 + 시작 라벨) ===== */}
      {data.map((group, gIdx) => {
        const pts = group.points.map((p) => ({ ...toPixel(p.x, p.y), x: p.x, y: p.y }))
        if (pts.length === 0) return null

        const start = pts[0]
        const moveCount = pts.length - 1
        // 라벨은 시작점 아래쪽으로 살짝 오프셋 (그룹마다 겹치지 않게 좌/우 번갈아 배치)
        const labelDx = gIdx % 2 === 0 ? -18 : 18
        const labelDy = 40
        const labelX = start.px + labelDx
        const labelY = start.py + labelDy

        return (
          <g key={`group-${gIdx}`} className="ct-group">
            {/* 이동 순서대로 화살표 연결 */}
            {pts.slice(0, -1).map((p, i) => {
              const next = pts[i + 1]
              return (
                <line
                  key={`arrow-${gIdx}-${i}`}
                  x1={p.px}
                  y1={p.py}
                  x2={next.px}
                  y2={next.py}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  markerEnd="url(#ct-arrowhead)"
                />
              )
            })}

            {/* 지점 점 표시 */}
            {pts.map((p, i) => (
              <circle
                key={`pt-${gIdx}-${i}`}
                cx={p.px}
                cy={p.py}
                r="3"
                fill="currentColor"
              />
            ))}

            {/* 시작점 리더라인 + 라벨 */}
            <line
              x1={start.px}
              y1={start.py}
              x2={labelX}
              y2={labelY - 8}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              fill="currentColor"
              fontSize="8"
            >
              {squareName(start.x, start.y)} start, {moveCount} moves
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default ConstellationThumb