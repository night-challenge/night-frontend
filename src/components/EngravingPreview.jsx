import '../styles/EngravingPreview.css'

// Figma 기준 좌표 (px, 140x160 캔버스 기준) — 각 카테고리의 모든 옵션(색상 등)에 공통 적용
const ENGRAVING_POSITION = {
  '가방': { x: 59, y: 103 },
  '트래블': { x: 59, y: 70 },
  '라이프스타일': { x: 59, y: 100 },
  '패션소품': { x: 56, y: 70 },
}

const ENGRAVING_SIZE = {
  '가방': { width: 14, height: 14 },
  '트래블': { width: 24, height: 23 },
  '라이프스타일': { width: 24, height: 20 },
  '패션소품': { width: 24, height: 20 },
}

// 좌표 계산 기준이 되는 원본 캔버스 크기 (Figma 기준값, 실제 화면 표시 크기 아님!)
const CANVAS_WIDTH = 140
const CANVAS_HEIGHT = 160

/**
 * constellationData.after의 points/connections를 받아 직접 그려주는 각인 마크.
 * 부모(.engraving-preview__overlay)의 실제 렌더링 크기에 맞춰 100% 채워지도록
 * viewBox만 유지하고 width/height는 CSS(100%)로 처리 → 반응형으로 자동 확대/축소됨.
 */
function ConstellationEngravingMark({ points, connections, color = 'gold' }) {
  const palette = {
    gold:   { base: '#C9A24B', light: '#FCEBB0', dark: '#8A6A22' },
    silver: { base: '#B0B0B0', light: '#F5F5F5', dark: '#6E6E6E' },
    black:  { base: '#2A2A2A', light: '#6A6A6A', dark: '#0A0A0A' },
  }
  const { base, light, dark } = palette[color] || palette.gold
  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]))
  const gid = `${color}-${Math.random().toString(36).slice(2, 8)}` // defs가 여러 개 그려질 때 id 충돌 방지

  return (
    <svg
      className="engraving-mark"
      viewBox="0 0 300 300"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bar-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`bead-${gid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <filter id={`shadow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {connections.map(([fromId, toId], i) => {
        const from = pointMap[fromId]
        const to = pointMap[toId]
        if (!from || !to) return null
        const dx = to.x - from.x
        const dy = to.y - from.y
        const length = Math.hypot(dx, dy)
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        const barWidth = 9
        return (
          <rect
            key={`bar-${i}`}
            x={from.x}
            y={-barWidth / 2}
            width={length}
            height={barWidth}
            rx={barWidth / 2}
            fill={`url(#bar-${gid})`}
            filter={`url(#shadow-${gid})`}
            transform={`translate(0 ${from.y}) rotate(${angle} ${from.x} 0)`}
          />
        )
      })}

      {points.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={11}
          fill={`url(#bead-${gid})`}
          filter={`url(#shadow-${gid})`}
        />
      ))}
    </svg>
  )
}

/**
 * @param {string} category - '가방' | '트래블' | '패션소품' | '라이프스타일'
 * @param {string} baseImageSrc - 제품 base svg
 * @param {{points: Array, connections: Array}} constellationData - 선택된 별자리의 after 데이터
 * @param {'gold'|'silver'|'black'} engravingColor - 선택된 각인 색상
 * @param {string} altText - base 이미지 alt
 *
 * ⚠️ scale prop 제거함: 더 이상 JS로 배율을 계산하지 않고, wrapper가
 * 부모 컨테이너 너비에 맞춰 100% 반응형으로 늘어나도록 변경 (CSS aspect-ratio 사용).
 * 모달에서 더 크게 보이게 하려면 .color-modal__preview 쪽 CSS에서 width만 조절하면 됨.
 */
function EngravingPreview({ category, baseImageSrc, constellationData, engravingColor, altText = '제품 이미지' }) {
  const position = ENGRAVING_POSITION[category] || { x: 0, y: 0 }
  const size = ENGRAVING_SIZE[category] || { width: 24, height: 24 }

  // px 좌표 → % 좌표로 변환 (컨테이너 실제 렌더링 크기와 무관하게 항상 같은 비율 위치 유지)
  const leftPct = (position.x / CANVAS_WIDTH) * 100
  const topPct = (position.y / CANVAS_HEIGHT) * 100
  const widthPct = (size.width / CANVAS_WIDTH) * 100
  const heightPct = (size.height / CANVAS_HEIGHT) * 100

  return (
    <div className="engraving-preview-wrapper">
      <img
        src={baseImageSrc}
        alt={altText}
        className="engraving-preview__base"
      />

      {constellationData && engravingColor && (
        <div
          className="engraving-preview__overlay"
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: `${widthPct}%`,
            height: `${heightPct}%`,
          }}
        >
          <ConstellationEngravingMark
            points={constellationData.points}
            connections={constellationData.connections}
            color={engravingColor}
          />
        </div>
      )}
    </div>
  )
}

export default EngravingPreview
export { ConstellationEngravingMark }