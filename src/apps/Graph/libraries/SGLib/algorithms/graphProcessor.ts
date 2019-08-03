import SimpleCluster from '../datatypes/simpleCluster';
import TinyQueue from '../structures/TinyQueue';

function sortingHelper(
  nodesIds: Set<number>,
  nodeMap: Map<number, Array<number>>
) {
  const queue = new TinyQueue<number>(Array.from(nodesIds), (id1, id2) => {
    const a = (nodeMap.get(id1) || []).length;
    const b = (nodeMap.get(id2) || []).length;
    return a < b ? -1 : a > b ? 1 : 0;
  });

  const topologicalArray = [];
  while (queue.size()) {
    const data = queue.pop();
    if (data === undefined) {
      throw new Error('data is undefined in the pop');
    }

    Array.from(nodeMap.values()).forEach(nodes => {
      while (nodes.indexOf(data) !== -1) {
        nodes.splice(nodes.indexOf(data), 1);
      }
    });

    topologicalArray.push(data);

    queue.reheapify();
  }

  return topologicalArray;
}

const topologicalSort = (cluster: SimpleCluster) => {
  if (!cluster.nonCyclic) {
    throw new Error(
      'Cluster must be cyclic first before running a topological sort!'
    );
  }
  const nodeLookup = cluster.nodeLookup;
  const nodesIds = new Set(Array.from(cluster.nodes.keys()));
  const incomingNodeMap: Map<number, Array<number>> = new Map();
  const outgoingNodeMap: Map<number, Array<number>> = new Map();

  Array.from(cluster.edgeLookup.keys())
    .map(edge => {
      const source = nodeLookup.get(edge.source);
      const target = nodeLookup.get(edge.target);
      if (source === undefined || target === undefined) {
        throw new Error('Source or target are somehow undefined');
      }

      return [source, target];
    })
    .forEach(edge => {
      const [source, target] = edge;

      if (!nodesIds.has(source) || !nodesIds.has(target)) {
        throw new Error(
          `NodeIds do not have source or target ${source} ${target}`
        );
      }

      if (!outgoingNodeMap.get(source)) {
        outgoingNodeMap.set(source, []);
      }
      if (!incomingNodeMap.get(target)) {
        incomingNodeMap.set(target, []);
      }

      const sourceMap = outgoingNodeMap.get(source);

      if (sourceMap === undefined) {
        throw new Error('SourceMap is somehow undefined');
      }

      sourceMap.push(target);

      const targetMap = incomingNodeMap.get(target);

      if (targetMap === undefined) {
        throw new Error('TargetMap or target are somehow undefined');
      }

      targetMap.push(source);
    });

  return {
    normal: sortingHelper(nodesIds, incomingNodeMap),
    reversed: sortingHelper(nodesIds, outgoingNodeMap)
  };
};

export default topologicalSort;
