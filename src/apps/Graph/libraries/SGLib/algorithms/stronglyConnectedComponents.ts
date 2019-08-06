import SimpleCluster from '../datatypes/graph/simpleCluster';

export const stronglyConnectedComponents = function(cluster: SimpleCluster) {
  const index_counter = [0];
  const stack: Array<number> = [];
  const lowLink: Map<number, number> = new Map();
  const index: Map<number, number> = new Map();
  const result: Array<Array<number>> = [];

  const strong_connect = function(nodeId: number) {
    index.set(nodeId, index_counter[0]);
    lowLink.set(nodeId, index_counter[0]);
    index_counter[0] = index_counter[0] + 1;
    stack.push(nodeId);

    const node = cluster.nodes.get(nodeId);

    if (!node) {
      throw new Error(`Node not found: ${node}`);
    }

    const successors = Array.from(node.outputs.values()).map(node => {
      const id = cluster.nodeLookup.get(node);
      if (id === undefined) {
        throw new Error(`Node not found: ${node}`);
      }
      return id;
    });

    successors.forEach(successor => {
      if (!index.has(successor)) {
        strong_connect(successor);
        if (
          lowLink.get(nodeId) === undefined ||
          lowLink.get(successor) === undefined
        ) {
          throw new Error(
            'Not defined: ' +
              node +
              ' ' +
              successor +
              ' ' +
              JSON.stringify(lowLink)
          );
        }

        const lowLinkNodeId = lowLink.get(nodeId) || 0;
        const lowLinkSuccessor = lowLink.get(successor) || 0;

        lowLink.set(nodeId, Math.min(lowLinkNodeId, lowLinkSuccessor));
      } else if (stack.includes(successor)) {
        if (
          lowLink.get(nodeId) === undefined ||
          lowLink.get(successor) === undefined
        ) {
          throw new Error(
            `Not defined: ${node} ${successor} ${JSON.stringify(lowLink)}`
          );
        }
        const lowLinkNodeId = lowLink.get(nodeId) || 0;
        const indexSuccessor = index.get(successor) || 0;

        lowLink.set(nodeId, Math.min(lowLinkNodeId, indexSuccessor));
      }
    });

    if (lowLink.get(nodeId) === index.get(nodeId)) {
      const connected_component: Array<number> = [];
      while (true) {
        const successor = stack.pop();
        if (successor === undefined) {
          throw new Error('Successor is undefined');
        }
        connected_component.push(successor);
        if (successor === nodeId) break;
      }
      result.push(connected_component.slice());
    }
  };

  Array.from(cluster.nodes.keys()).forEach(key => {
    if (!index.has(key)) {
      strong_connect(key);
    }
  });

  return result;
};
