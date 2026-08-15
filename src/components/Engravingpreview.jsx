import '../styles/EngravingPreview.css'

// Figma 기준 좌표 (px) — 각 카테고리의 모든 옵션(색상 등)에 공통 적용
// 값: 각인 오버레이의 좌상단(top-left)이 위치할 좌표
const ENGRAVING_POSITION = {
  '가방': { x: 59, y: 103 },      // ← 이 x, y 값이 지금 틀려서 가방 아래 흰 여백에 찍힘
  '트래블': { x: 59, y: 70 },
  '라이프스타일': { x: 59, y: 107 },
  '패션소품': { x: 56, y: 59 },
}

// TODO: 카테고리별 실제 각인 표시 크기(width/height, px) 확인 필요 — 지금은 임시값
const ENGRAVING_SIZE = {
  '가방': { width: 24, height: 24 },   // ← 이 크기도 확정된 값이 아니라 임시값
  '트래블': { width: 24, height: 24 },
  '라이프스타일': { width: 24, height: 24 },
  '패션소품': { width: 24, height: 24 },
}

// 각인 색상 실제 표시 색상 (필요 시 디자인 시안 값으로 교체)
const ENGRAVING_COLOR = {
  gold: '#C9A24B',
  silver: '#B0B0B0',
  black: '#1A1A1A',
}

// 기준 제품 svg의 실제 렌더링 크기
const CANVAS_WIDTH = 140
const CANVAS_HEIGHT = 160

/**
 * constellationData.after의 points/connections를 받아 직접 그려주는 각인 마크.
 * points: [{ id, x, y }, ...]  — 300x300 캔버스 좌표
 * connections: [{ from, to }, ...]  — points의 id를 참조
 * ⚠️ connections의 실제 필드명(from/to vs 배열 [id, id] 등)은 백엔드 응답 확인 후 맞춰주세요.
 */
function ConstellationEngravingMark({ points, connections, color = 'gold', size }) {
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
      width={size.width}
      height={size.height}
    >
      <defs>
        {/* 원통형 바 느낌: 짧은 축(폭) 방향으로 밝음→어두움→밝음 */}
        <linearGradient id={`bar-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        {/* 구슬 느낌: 좌상단에 하이라이트가 몰린 방사형 그라디언트 */}
        <radialGradient id={`bead-${gid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <filter id={`shadow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 연결선: 얇은 <line> 대신 회전된 <rect>로 원통형 바를 그림 */}
      {connections.map((conn, i) => {
        const from = pointMap[conn.from]
        const to = pointMap[conn.to]
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

      {/* 점: 방사형 그라디언트로 구슬 입체감 */}
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
 * @param {string} baseImageSrc - 제품 base svg (사용자가 별도 업로드 예정)
 * @param {{points: Array, connections: Array}} constellationData - 선택된 별자리의 after 데이터 (없으면 오버레이 미표시)
 * @param {'gold'|'silver'|'black'} engravingColor - 선택된 각인 색상
 * @param {string} altText - base 이미지 alt
 */
/**
 * @param {number} scale - 140x160 캔버스를 확대 표시할 배율 (좌표계는 그대로 유지되므로 어긋나지 않음). 기본 1.
 */
function EngravingPreview({ category, baseImageSrc, constellationData, engravingColor, altText = '제품 이미지', scale = 1 }) {
  const position = ENGRAVING_POSITION[category] || { x: 0, y: 0 }
  const size = ENGRAVING_SIZE[category] || { width: 24, height: 24 }

  return (
    // 바깥 wrapper: 실제 화면에서 차지하는 크기 (scale 적용된 크기)
    <div
      className="engraving-preview-wrapper"
      style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
    >
      {/* 안쪽: 항상 140x160 고정 좌표계 유지, transform으로만 확대 */}
      <div
        className="engraving-preview"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <img
          src={baseImageSrc}
          alt={altText}
          className="engraving-preview__base"
        />

        {constellationData && engravingColor && (
          <div
            className="engraving-preview__overlay"
            style={{ left: position.x, top: position.y }}
          >
            <ConstellationEngravingMark
              points={constellationData.points}
              connections={constellationData.connections}
              color={engravingColor}
              size={size}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EngravingPreview
export { ConstellationEngravingMark }