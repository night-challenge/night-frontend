// gameTrajectory.js
//
// ⚠️ 스펙 변경: 이제 백엔드가 constellationData.before / constellationData.after를
//    둘 다 계산해서 내려주기 때문에, 실제 화면(GameSessionDetail 등)에서는
//    buildConstellation()을 더 이상 호출할 필요가 없다.
//    이 파일에 남아있는 파이프라인은 "mockGameSession"에서 백엔드 응답을
//    흉내내기 위한 용도로만 사용한다.
//
//   [before 전용] buildKnightPathBefore
//     -> knightMoveLog를 "이동 순서대로 연결" (nearest-neighbor 아님)
//     -> { points: [{id,x,y}], connections: [[id,id],...] } (격자 좌표 그대로)
//
//   [after 전용, 기존 로직 유지] buildBefore -> dedupAndScaleToCanvas -> densify
//     -> connectNearestNeighbors -> bridgeDisconnectedGroups
//     -> { points: [{id,x,y}], connections: [[id,id],...] } (300x300 캔버스 좌표)

export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 300; // ConstellationThumb viewBox height(320)보다 20 작게 -> 하단 여백
export const MARGIN_RATIO = 0.1;
const GRID_MAX = 7; // 체스보드 좌표는 0~7

// ---------------------------------------------------------------------------
// [NEW] before payload 생성
//   - 실제로 이동이 이어지는 구간(직전 move.toX/toY === 이번 move.fromX/fromY)만
//     같은 id로 연결하고, 끊기는 구간(캡처/재배치 등)은 새 시작점으로 분리한다.
//   - 그 결과 화면에는 여러 개의 독립된 화살표 묶음(=여러 "start")이 생길 수 있다.
//     (첨부 이미지의 "B1 start, 3 moves" / "G1 start, 4 moves"처럼)
//   - 같은 칸을 재방문해도 항상 새로운 id를 부여한다 (스펙 문서 그대로).
// ---------------------------------------------------------------------------
export function buildKnightPathBefore(knightMoveLog) {
  if (!knightMoveLog || knightMoveLog.length === 0) {
    return { points: [], connections: [] };
  }

  const points = [];
  const connections = [];
  let id = 0;
  let lastPointId = null;
  let lastX = null;
  let lastY = null;

  for (const move of knightMoveLog) {
    const isContinuous = lastPointId !== null && lastX === move.fromX && lastY === move.fromY;

    let fromId;
    if (isContinuous) {
      fromId = lastPointId; // 직전 이동의 도착점을 그대로 이어서 사용
    } else {
      fromId = id++;
      points.push({ id: fromId, x: move.fromX, y: move.fromY });
    }

    const toId = id++;
    points.push({ id: toId, x: move.toX, y: move.toY });
    connections.push([fromId, toId]);

    lastPointId = toId;
    lastX = move.toX;
    lastY = move.toY;
  }

  return { points, connections };
}

// ---------------------------------------------------------------------------
// [기존 유지 - after 계산용] buildBefore
//   knightMoveLog를 이동 순서대로 쭉 펼쳐서 "이동 이전" 상태의 전체 방문 이력을
//   만든다. (여기서의 "before"는 스펙 문서의 before와는 이름만 겹칠 뿐 다른 개념 —
//   after 파이프라인의 1단계일 뿐이다. 헷갈리면 buildKnightPathBefore와 구분할 것.)
// ---------------------------------------------------------------------------
export function buildBefore(knightMoveLog) {
  if (!knightMoveLog || knightMoveLog.length === 0) return [];

  const points = [];
  let id = 0;

  const first = knightMoveLog[0];
  points.push({ id: id++, x: first.fromX, y: first.fromY, turn: 0 });

  for (const move of knightMoveLog) {
    points.push({ id: id++, x: move.toX, y: move.toY, turn: move.turn });
  }

  return points;
}

export function dedupAndScaleToCanvas(
  points,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT,
  marginRatio = MARGIN_RATIO
) {
  const marginX = canvasWidth * marginRatio;
  const marginY = canvasHeight * marginRatio;
  const usableX = canvasWidth - marginX * 2;
  const usableY = canvasHeight - marginY * 2;

  const toCanvas = (gx, gy) => ({
    x: marginX + (gx / GRID_MAX) * usableX,
    y: marginY + ((GRID_MAX - gy) / GRID_MAX) * usableY,
  });

  const map = new Map();
  for (const p of points) {
    const key = `${p.x},${p.y}`;
    if (!map.has(key)) {
      const { x, y } = toCanvas(p.x, p.y);
      map.set(key, { id: p.id, gridX: p.x, gridY: p.y, x, y, visits: 1, real: true });
    } else {
      map.get(key).visits += 1;
    }
  }

  return Array.from(map.values());
}

export function densify(
  points,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT,
  marginRatio = MARGIN_RATIO
) {
  const marginX = canvasWidth * marginRatio;
  const marginY = canvasHeight * marginRatio;
  const usableX = canvasWidth - marginX * 2;
  const usableY = canvasHeight - marginY * 2;

  const real = points.length;
  const ratio = 0.3 + Math.random() * 0.2;
  const addCount = Math.round(real * ratio);
  const target = Math.min(18, Math.max(10, real + addCount));
  const toAdd = Math.max(0, target - real);

  const extra = Array.from({ length: toAdd }, (_, i) => ({
    id: `d${i}`,
    gridX: null,
    gridY: null,
    x: marginX + Math.random() * usableX,
    y: marginY + Math.random() * usableY,
    visits: 0,
    real: false,
  }));

  return [...points, ...extra];
}

export function connectNearestNeighbors(points) {
  const edgeSet = new Set();
  const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  for (const p of points) {
    const k = 2 + Math.round(Math.random());
    const neighbors = points
      .filter((q) => q.id !== p.id)
      .map((q) => ({ q, d: dist(p, q) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);

    for (const { q } of neighbors) {
      edgeSet.add(edgeKey(String(p.id), String(q.id)));
    }
  }

  return edgeSet;
}

class UnionFind {
  constructor(ids) {
    this.parent = new Map(ids.map((id) => [id, id]));
  }
  find(x) {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)));
    }
    return this.parent.get(x);
  }
  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

export function bridgeDisconnectedGroups(points, edgeSet) {
  const ids = points.map((p) => String(p.id));
  const uf = new UnionFind(ids);

  for (const key of edgeSet) {
    const [a, b] = key.split("|");
    uf.union(a, b);
  }

  const byId = new Map(points.map((p) => [String(p.id), p]));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

  let groups = groupById(uf, ids);

  while (groups.length > 1) {
    const [groupA, groupB] = findClosestGroups(groups, byId, dist);

    let best = null;
    for (const a of groupA) {
      for (const b of groupB) {
        const d = dist(byId.get(a), byId.get(b));
        if (!best || d < best.d) best = { a, b, d };
      }
    }

    edgeSet.add(edgeKey(best.a, best.b));
    uf.union(best.a, best.b);
    groups = groupById(uf, ids);
  }

  return edgeSet;
}

function groupById(uf, ids) {
  const map = new Map();
  for (const id of ids) {
    const root = uf.find(id);
    if (!map.has(root)) map.set(root, []);
    map.get(root).push(id);
  }
  return Array.from(map.values());
}

function findClosestGroups(groups, byId, dist) {
  let best = null;
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      for (const a of groups[i]) {
        for (const b of groups[j]) {
          const d = dist(byId.get(a), byId.get(b));
          if (!best || d < best.d) best = { pair: [groups[i], groups[j]], d };
        }
      }
    }
  }
  return best.pair;
}

// [mock 전용] "after" 데이터를 흉내낼 때만 사용. 실제 서비스에선 백엔드 응답의
// constellationData.after를 그대로 쓴다.
export function buildConstellation(knightMoveLog) {
  const before = buildBefore(knightMoveLog);
  const deduped = dedupAndScaleToCanvas(before);
  const densified = densify(deduped);
  const edgeSet = connectNearestNeighbors(densified);
  const bridgedEdgeSet = bridgeDisconnectedGroups(densified, edgeSet);

  const connections = Array.from(bridgedEdgeSet).map((key) => key.split("|"));

  return {
    points: densified.map(({ id, x, y }) => ({ id: String(id), x, y })),
    connections,
  };
}