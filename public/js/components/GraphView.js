function GraphView({ graph, path }) {
  const R = 130;
  const C = 160;
  const nodeCount = graph.nodes.length;

  const positions = React.useMemo(() => {
    if (!nodeCount) return {};

    return Object.fromEntries(
      graph.nodes.map((id, index) => {
        const angle = (2 * Math.PI * index) / nodeCount - Math.PI / 2;
        return [
          id,
          {
            x: C + R * Math.cos(angle),
            y: C + R * Math.sin(angle),
          },
        ];
      }),
    );
  }, [graph.nodes, nodeCount]);

  const onPath = (fromId, toId) => {
    if (!path || path.length < 2) return false;

    return path.some((current, index) => {
      if (index >= path.length - 1) return false;
      return (
        (current === fromId && path[index + 1] === toId) ||
        (current === toId && path[index + 1] === fromId)
      );
    });
  };

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="Network of people and connections"
    >
      {graph.edges.map(([a, b]) => {
        const isHighlighted = onPath(a, b);
        const start = positions[a];
        const end = positions[b];

        if (!start || !end) return null;

        return (
          <line
            key={`${a}-${b}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={isHighlighted ? "var(--hit)" : "var(--line)"}
            strokeWidth={isHighlighted ? 3 : 1.5}
          />
        );
      })}

      {graph.nodes.map((id) => {
        const point = positions[id];
        if (!point) return null;

        return (
          <g key={id}>
            <circle
              cx={point.x}
              cy={point.y}
              r="15"
              fill={path?.includes(id) ? "var(--hit)" : "var(--node)"}
            />
            <text
              x={point.x}
              y={point.y + 4}
              textAnchor="middle"
              fontSize="10"
              fill="var(--bg)"
            >
              {id.slice(0, 4)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

window.GraphView = GraphView;
