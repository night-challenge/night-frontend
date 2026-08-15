// EngravingConstellationPreview.jsx
// 각인(engraving) Before/After 미리보기 전용 컴포넌트.
// ConstellationThumb.jsx(게임 보드용)와는 별개 파일입니다 — 이 파일을
// ConstellationThumb.jsx 자리에 덮어쓰지 마세요.
//
// before: 백엔드가 0~7 격자좌표로 줌 -> 캔버스 좌표로 변환해서 렌더
// after:  이미 300x300 캔버스 좌표로 옴 -> 그대로 사용
import { toCanvasPoints } from '../data/coordSpace'

function EngravingConstellationPreview({ before, after }) {
  const beforeCanvasPoints = toCanvasPoints(before?.points, 'grid')
  const afterCanvasPoints = toCanvasPoints(after?.points, 'canvas')

  return (
    <>
      <svg viewBox="0 0 300 300" className="engraving-constellation">
        {beforeCanvasPoints.map((p) => (
          <circle key={p.id} cx={p.x} cy={p.y} r="3" fill="currentColor" />
        ))}
      </svg>

      <svg viewBox="0 0 300 300" className="engraving-constellation">
        {afterCanvasPoints.map((p) => (
          <circle key={p.id} cx={p.x} cy={p.y} r="3" fill="currentColor" />
        ))}
      </svg>
    </>
  )
}

export default EngravingConstellationPreview