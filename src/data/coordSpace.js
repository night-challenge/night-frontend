// coordSpace.js
// 백엔드가 Before(0~7 격자좌표)와 After(300x300 캔버스좌표)를 다른 좌표계로 준다는
// 전제 하에, 렌더링 직전에 항상 "300x300 캔버스 좌표"로 통일시켜주는 유틸입니다.
//
// 사용법:
//   const canvasPoints = toCanvasPoints(points, coordSpace) // coordSpace: 'grid' | 'canvas'
//
// - coordSpace === 'grid'   -> 0~7 격자좌표라고 보고 스케일 + 여백 적용
// - coordSpace === 'canvas' -> 이미 300x300 기준이라고 보고 그대로 통과

export const CANVAS_SIZE = 300;
export const MARGIN_RATIO = 0.1;
const GRID_MAX = 7;

function gridToCanvas(x, y, canvasSize = CANVAS_SIZE, marginRatio = MARGIN_RATIO) {
  const margin = canvasSize * marginRatio;
  const usable = canvasSize - margin * 2;
  return {
    x: margin + (x / GRID_MAX) * usable,
    y: margin + (y / GRID_MAX) * usable,
    // 게임 보드처럼 y=0이 아래(1행)로 와야 하면 아래 줄로 바꾸세요:
    // y: margin + ((GRID_MAX - y) / GRID_MAX) * usable,
  };
}

export function toCanvasPoints(points, coordSpace) {
  if (!points) return [];

  if (coordSpace === 'grid') {
    return points.map((p) => ({ ...p, ...gridToCanvas(p.x, p.y) }));
  }

  // coordSpace === 'canvas' (또는 미지정 시 기본값) -> 이미 300x300 좌표이므로 그대로 사용
  return points;
}