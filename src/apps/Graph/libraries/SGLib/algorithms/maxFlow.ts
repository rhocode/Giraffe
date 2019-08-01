function bfs(
  graph: Map<number, Map<number, number>>,
  s: number,
  t: number,
  parent: Map<number, number>
): boolean {
  const visited: Map<number, boolean> = new Map();
  let queue: Array<number> = [];

  queue.push(s);
  visited.set(s, true);
  parent.set(s, -1);

  while (queue.length !== 0) {
    const u = queue.shift();
    if (u === undefined) {
      continue;
    }
    const entry = graph.get(u);
    if (entry === undefined) {
      continue;
    }

    Array.from(entry.keys()).forEach((key: number) => {
      if (visited.get(key) !== true) {
        const uv = entry.get(key);
        if (uv !== undefined && uv > 0) {
          queue.push(key);
          parent.set(key, u);
          visited.set(key, true);
        }
      }
    });
  }

  return visited.get(t) === true;
}

function maxFlow(
  graph: Map<number, Map<number, number>>,
  s: number,
  t: number
) {
  const residualGraph = new Map() as any;

  Array.from(graph.entries()).forEach(entry => {
    const [key, value] = entry;

    residualGraph.set(key, new Map(value));
  });

  const parentArray: Map<number, number> = new Map();
  let maxFlow = 0;

  while (bfs(residualGraph, s, t, parentArray)) {
    let pathFlow = Number.MAX_VALUE;

    for (let v = t; v !== s; v = parentArray.get(v) || 0) {
      let u = parentArray.get(v);
      pathFlow = Math.min(pathFlow, (residualGraph.get(u) || new Map()).get(v));
    }

    for (let v = t; v !== s; v = parentArray.get(v) || 0) {
      let u = parentArray.get(v) || 0;
      const uv = residualGraph.get(u).get(v);
      residualGraph.get(u).set(v, uv - pathFlow);

      if (residualGraph.get(v) === undefined) {
        residualGraph.set(v, new Map());
      }

      if (residualGraph.get(v).get(u) === undefined) {
        residualGraph.get(v).set(u, 0);
      }

      const vu = residualGraph.get(v).get(u);

      residualGraph.get(v).set(u, vu + pathFlow);
    }

    maxFlow += pathFlow;
  }

  // Return the overall flow
  return maxFlow;
}

export default maxFlow;
