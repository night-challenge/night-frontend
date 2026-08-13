function ConstellationThumb({ data, size = 56 }) {
  if (!data || !data.points || !data.connections) {
    return <div className="constellation-thumb constellation-thumb--empty" style={{ width: size, height: size }} />
  }

  const { points, connections } = data
  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]))

  return (
    <svg
      viewBox="0 0 300 320"
      width={size}
      height={size}
      className="constellation-thumb"
    >
      {connections.map(([fromId, toId], idx) => {
        const p1 = pointMap[fromId]
        const p2 = pointMap[toId]
        if (!p1 || !p2) return null
        return (
          <line
            key={`line-${idx}`}
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
        <circle key={`point-${p.id}`} cx={p.x} cy={p.y} r="3.5" fill="currentColor" />
      ))}
    </svg>
  )
}

export default ConstellationThumb