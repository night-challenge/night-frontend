// EngravingConstellation.jsx
// 각인(engraving) Before/After 별자리 렌더링 전용 컴포넌트.
// (게임판 이동 기록을 보여주는 components/ConstellationThumb.jsx는 게임 탭에서
//  전혀 다른 용도(격자+화살표)로 쓰고 있어서 별개 파일로 둡니다. 절대 그 파일
//  자리에 덮어쓰지 마세요.)
//
// 백엔드 응답 기준:
//   before: 게임판 격자 좌표 (x축 A~H → 0~7, y축 1~8 → 0~7)
//   after : 300×300 캔버스 좌표 (그대로 사용)
// space="grid" 로 넘기면 before를 300×300 캔버스 좌표로 스케일+여백 변환해서
// after와 동일한 방식으로 렌더링합니다.
import { toCanvasPoints } from '../data/coordSpace'

const CANVAS_SIZE = 300

function EngravingConstellation({ data, space = 'canvas', size = CANVAS_SIZE }) {
  if (!data || !data.points || data.points.length === 0) {
    return (
      <div
        className="engraving-constellation engraving-constellation--empty"
        style={{ width: size, height: size }}
      />
    )
  }

  const points = toCanvasPoints(data.points, space)
  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]))

  return (
    <svg
      viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      width={size}
      height={size}
      className="engraving-constellation"
    >
      {(data.connections || []).map(([a, b], i) => {
        const p1 = pointMap[a]
        const p2 = pointMap[b]
        if (!p1 || !p2) return null
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )
      })}
      {points.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="3.5" fill="currentColor" />
      ))}
    </svg>
  )
}

export default EngravingConstellation
