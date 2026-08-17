// beforeGroups.js
// Before 데이터(points + connections)를 ConstellationThumb(게임 탭 공용)이 기대하는
// "분리된 경로 그룹" 형태로 변환한다.
//
// 문제: points를 통째로 하나의 그룹으로 넘기면, ConstellationThumb이 그룹 안의
// 인접한 점들을 순서대로 다 이어버려서 서로 다른 나이트의 경로 사이에도
// 실제로 이동하지 않은 연결선이 그려질 수 있다.
//
// 해결: connections(백엔드가 준 이동 순서 간선)를 기준으로 Union-Find로
// 서로 연결된 점들만 같은 컴포넌트(=하나의 나이트 경로)로 묶고,
// 각 컴포넌트 안에서는 간선의 방향을 따라가며 실제 이동 순서대로 정렬한다.
//
// 반환 형태: [{ points: [{x,y}, ...] }, ...] (경로별로 분리된 그룹 배열)

export function buildBeforeGroups(points, connections) {
  if (!points || points.length === 0) return []

  // connections 정보가 없으면(구버전 데이터 등) 기존처럼 전체를 하나의 그룹으로 취급
  if (!connections || connections.length === 0) {
    return [{ points: points.map((p) => ({ x: p.x, y: p.y })) }]
  }

  const pointMap = new Map(points.map((p) => [p.id, p]))

  // 1) Union-Find로 서로 연결된 점들을 같은 경로(컴포넌트)로 묶는다.
  const parent = new Map(points.map((p) => [p.id, p.id]))
  const find = (id) => {
    while (parent.get(id) !== id) {
      parent.set(id, parent.get(parent.get(id)))
      id = parent.get(id)
    }
    return id
  }
  const union = (a, b) => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent.set(ra, rb)
  }
  connections.forEach(([a, b]) => {
    if (pointMap.has(a) && pointMap.has(b)) union(a, b)
  })

  // 2) 컴포넌트(root)별로 점 id 모으기
  const idsByRoot = new Map()
  points.forEach((p) => {
    const root = find(p.id)
    if (!idsByRoot.has(root)) idsByRoot.set(root, new Set())
    idsByRoot.get(root).add(p.id)
  })

  // 3) 컴포넌트별로 간선 모으기 (방향 그대로: a -> b)
  const edgesByRoot = new Map()
  connections.forEach(([a, b]) => {
    if (!pointMap.has(a) || !pointMap.has(b)) return
    const root = find(a)
    if (!edgesByRoot.has(root)) edgesByRoot.set(root, [])
    edgesByRoot.get(root).push([a, b])
  })

  // 4) 각 컴포넌트를 이동 순서(간선 방향)대로 정렬해서 points 배열로 변환
  const groups = []
  idsByRoot.forEach((idSet, root) => {
    const edges = edgesByRoot.get(root) || []
    const outMap = new Map() // a -> b
    const hasIncoming = new Set()
    edges.forEach(([a, b]) => {
      outMap.set(a, b)
      hasIncoming.add(b)
    })

    // 시작점: 들어오는 간선이 없는 점(경로의 첫 이동). 없으면 컴포넌트의 아무 점.
    let startId = [...idSet].find((id) => !hasIncoming.has(id))
    if (startId === undefined) startId = [...idSet][0]

    const orderedIds = []
    const visited = new Set()
    let cur = startId
    while (cur !== undefined && !visited.has(cur)) {
      orderedIds.push(cur)
      visited.add(cur)
      cur = outMap.get(cur)
    }
    // 분기 등으로 못 돈 점이 있으면 원래 순서대로 뒤에 붙인다(누락 방지)
    idSet.forEach((id) => {
      if (!visited.has(id)) orderedIds.push(id)
    })

    groups.push({
      points: orderedIds
        .map((id) => pointMap.get(id))
        .filter(Boolean)
        .map((p) => ({ x: p.x, y: p.y })),
    })
  })

  return groups
}
