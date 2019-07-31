function bfs(
  graph: Map<number, Map<number, number>>,
  s: number,
  t: number,
  parent: Map<number, number>
): boolean {
  const visited: Map<number, boolean> = new Map();
  let queue: Array<number> = [];

  // Create a queue, enqueue source vertex and mark source vertex as visited
  queue.push(s);
  visited.set(s, true);
  parent.set(s, -1);

  while (queue.length !== 0) {
    // console.error(queue);
    const u = queue.shift();
    if (u === undefined) {
      continue;
    }
    const entry = graph.get(u);
    if (entry === undefined) {
      continue;
    }
    // console.error("!!!!!!!!!!!!!!!!!!", graph.get(u))
    Array.from(entry.keys()).forEach((key: number) => {
      if (visited.get(key) !== true) {
        const uv = entry.get(key);
        console.error(entry, key, uv);
        if (uv !== undefined && uv > 0) {
          queue.push(key);
          parent.set(key, u);
          visited.set(key, true);
        }
      }
    });
  }
  // console.error(visited, t, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!fkdsfnlksdfnlks")
  //If we reached sink in BFS starting from source, then return true, else false
  return visited.get(t) === true;
}

function maxFlow(
  graph: Map<number, Map<number, number>>,
  s: number,
  t: number
) {
  /* Create a residual graph and fill the residual graph
   with given capacities in the original graph as
   residual capacities in residual graph
   Residual graph where rGraph[i][j] indicates
   residual capacity of edge from i to j (if there
   is an edge. If rGraph[i][j] is 0, then there is
   not)
  */

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
      if (residualGraph[u] === undefined) {
        residualGraph[u] = new Map();
      }

      residualGraph[u][v] -= pathFlow;
      residualGraph[v][u] += pathFlow;
    }

    maxFlow += pathFlow;
  }
  // Return the overall flow
  return maxFlow;
}

export default maxFlow;
