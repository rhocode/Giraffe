import SimpleCluster from '../datatypes/simpleCluster';
import GroupNode from '../datatypes/groupNode';
import SimpleNode from '../datatypes/simpleNode';
import ClusterChain from '../datatypes/clusterChain';

const generatePools = (
  cluster: SimpleCluster,
  topologicalOrder: Array<number>
) => {
  let newPoolIndex = 0;
  const poolInput: Map<SimpleNode, Set<number>> = new Map();
  const poolOutput: Map<SimpleNode, Set<number>> = new Map();

  topologicalOrder.forEach(nodeIndex => {
    const node = cluster.nodes.get(nodeIndex);
    if (node === undefined) {
      throw new Error('Node is undefined ' + nodeIndex);
    }

    let clusterNodeIsBoundary = false;

    if (node instanceof GroupNode) {
      if (node.subNodes.length > 1) {
        clusterNodeIsBoundary = false;
      } else {
        clusterNodeIsBoundary = node.subNodes[0].isClusterBoundary;
      }
    } else {
      clusterNodeIsBoundary = node.isClusterBoundary;
    }

    // 1. Process all incoming pool indexes, reduce all pool indexes to a singular index.
    const allIncomingIndexes = poolInput.get(node);
    let localIndex = -1;
    if (allIncomingIndexes === undefined) {
      //    1.1 If none exists, attach an index and increment the index counter (but do not put it into the incoming node array)
      localIndex = newPoolIndex++;
    } else {
      // (reduce all pool indexes to a singular index)
      const minIndex = Math.min(...Array.from(allIncomingIndexes));
      localIndex = minIndex;

      // // 2. Replace all existing pool indexes with the singular index found in 1.
      allIncomingIndexes.forEach(index => {
        if (index === minIndex) return;

        //   // Simplify input pool
        Array.from(poolInput.values()).forEach(inputSet => {
          if (inputSet.has(index)) {
            inputSet.delete(index);
            inputSet.add(minIndex);
          }
        });

        // Simplify output pools
        Array.from(poolOutput.values()).forEach(outputSet => {
          if (outputSet.has(index)) {
            outputSet.delete(index);
            outputSet.add(minIndex);
          }
        });
      });
      if (allIncomingIndexes.size !== 1) {
        throw new Error('All Incoming Indexes size is not 1');
      }
    }

    // // 3. If the cluster is a boundary BUT has outgoing nodes, the outgoing pool is set to an incremented index.
    if (clusterNodeIsBoundary && node.outputs.size > 0) {
      const newIncrementedIndex = newPoolIndex++;

      poolOutput.set(node, new Set([newIncrementedIndex]));

      // Set each output to the correct poolv
      Array.from(node.outputs.values()).forEach(output => {
        const inputOfOutputNode = poolInput.get(output);
        if (inputOfOutputNode === undefined) {
          poolInput.set(output, new Set([newIncrementedIndex]));
        } else {
          inputOfOutputNode.add(newIncrementedIndex);
        }
      });
    } else if (!clusterNodeIsBoundary && node.outputs.size > 0) {
      //    3.1 If the cluster is NOT a boundary and has outgoing nodes, propagate the index forward

      poolOutput.set(node, new Set([localIndex]));

      node.outputs.forEach(output => {
        const inputOfOutputNode = poolInput.get(output);
        if (inputOfOutputNode === undefined) {
          poolInput.set(output, new Set([localIndex]));
        } else {
          inputOfOutputNode.add(localIndex);
        }
      });
    }

    // 4. Intermediate nodes are where incoming and outgoing pools are the same.
  });

  const poolInputs: Map<number, Array<SimpleNode>> = new Map();
  const poolOutputs: Map<number, Array<SimpleNode>> = new Map();
  const poolIntermediates: Map<number, Array<SimpleNode>> = new Map();

  Array.from(cluster.nodes.values()).forEach(entry => {
    const input = poolInput.get(entry);
    const output = poolOutput.get(entry);

    if (input === undefined && input === output) {
      // One single node, add this node to its own cluster.
      // TODO: Add this to the clusters list
    } else if (input === output) {
      throw new Error('never should happen!!');
    } else {
      if (input !== undefined && output !== undefined) {
        const inputElement = Array.from(input)[0];
        const outputElement = Array.from(output)[0];

        if (inputElement === outputElement) {
          let intermediate = poolIntermediates.get(inputElement);
          if (intermediate === undefined) {
            poolIntermediates.set(inputElement, []);
            intermediate = poolIntermediates.get(inputElement);
          }

          if (intermediate === undefined) {
            throw new Error('intermediate is undefined');
          }
          intermediate.push(entry);
          return;
        }
      }

      if (input !== undefined) {
        if (input.size !== 1) {
          throw new Error("There's more than one input!");
        }
        const inputElement = Array.from(input)[0];

        let poolOutputLocal = poolOutputs.get(inputElement);

        if (poolOutputLocal === undefined) {
          poolOutputs.set(inputElement, []);
          poolOutputLocal = poolOutputs.get(inputElement);
        }

        if (poolOutputLocal === undefined) {
          throw new Error('poolOutputLocal is undefined');
        }
        poolOutputLocal.push(entry);
      }

      if (output !== undefined) {
        if (output.size !== 1) {
          throw new Error("There's more than one output!");
        }

        const outputElement = Array.from(output)[0];

        let poolInputLocal = poolInputs.get(outputElement);

        if (poolInputLocal === undefined) {
          poolInputs.set(outputElement, []);
          poolInputLocal = poolInputs.get(outputElement);
        }

        if (poolInputLocal === undefined) {
          throw new Error('poolInputLocal is undefined');
        }
        poolInputLocal.push(entry);
      }
    }
  });

  const topologicalNodesToIndex: Map<SimpleNode, number> = new Map();

  topologicalOrder.forEach((nodeIndex, absoluteIndex) => {
    const node = cluster.nodes.get(nodeIndex);
    if (node === undefined) {
      throw new Error('Node is undefined ' + nodeIndex);
    }
    topologicalNodesToIndex.set(node, absoluteIndex);
  });

  const topologicalSortFunction = (a: SimpleNode, b: SimpleNode) => {
    const aLookup = topologicalNodesToIndex.get(a);
    const bLookup = topologicalNodesToIndex.get(b);
    if (aLookup === undefined) {
      throw new Error('A is undefined' + a);
    }

    if (bLookup === undefined) {
      throw new Error('B is undefined' + b);
    }

    return aLookup - bLookup;
  };

  const allPools = new Set([
    ...Array.from(poolInputs.keys()),
    ...Array.from(poolOutputs.keys()),
    ...Array.from(poolIntermediates.keys())
  ]);

  allPools.forEach(pool => {
    const sources = poolInputs.get(pool);
    if (sources === undefined) {
      throw new Error('sources is undefined');
    }

    sources.sort(topologicalSortFunction);

    let contents = poolIntermediates.get(pool);

    if (contents === undefined) {
      contents = [];
    }

    contents.sort(topologicalSortFunction);

    const outputs = poolOutputs.get(pool);

    if (outputs === undefined) {
      throw new Error('contents is undefined');
    }

    outputs.sort(topologicalSortFunction);
  });

  const reversePoolInputLookup: Map<SimpleNode, number> = new Map();
  const reversePoolOutputLookup: Map<SimpleNode, number> = new Map();
  const reversePoolIntermediateLookup: Map<SimpleNode, number> = new Map();

  Array.from(poolInputs.entries()).forEach(entry => {
    const [poolId, nodeArray] = entry;
    nodeArray.forEach(node => {
      if (reversePoolInputLookup.has(node)) {
        throw new Error('Node exists where it should not!');
      }
      reversePoolInputLookup.set(node, poolId);
    });
  });

  Array.from(poolIntermediates.entries()).forEach(entry => {
    const [poolId, nodeArray] = entry;
    nodeArray.forEach(node => {
      if (reversePoolOutputLookup.has(node)) {
        throw new Error('Node exists where it should not!');
      }
      reversePoolOutputLookup.set(node, poolId);
    });
  });

  Array.from(poolOutputs.entries()).forEach(entry => {
    const [poolId, nodeArray] = entry;
    nodeArray.forEach(node => {
      if (reversePoolIntermediateLookup.has(node)) {
        throw new Error('Node exists where it should not!');
      }
      reversePoolIntermediateLookup.set(node, poolId);
    });
  });

  const visitedPools: Set<number> = new Set();
  const clusters: Array<ClusterChain> = [];

  topologicalOrder.forEach(nodeIndex => {
    const node = cluster.nodes.get(nodeIndex);
    if (node === undefined) {
      throw new Error('Node is undefined ' + nodeIndex);
    }

    if (reversePoolInputLookup.has(node)) {
      // is a head
      const poolId = reversePoolInputLookup.get(node);
      if (poolId === undefined) {
        throw new Error('undefined poolId in reversePool');
      }
      if (!visitedPools.has(poolId)) {
        visitedPools.add(poolId);
        const start = poolInputs.get(poolId);
        const middle = poolIntermediates.get(poolId) || [];
        const end = poolOutputs.get(poolId);

        if (start === undefined) {
          throw new Error('PoolId ' + poolId + ' is undefined in start');
        }

        if (end === undefined) {
          throw new Error('PoolId ' + poolId + ' is undefined in start');
        }

        const startCluster = new SimpleCluster(start, false, true);
        const middleCluster = new SimpleCluster(middle, false, true);
        const endCluster = new SimpleCluster(end, false, true);

        const clusterChain = new ClusterChain(
          startCluster,
          middleCluster,
          endCluster
        );
        clusters.push(clusterChain);
      }
    }

    if (reversePoolOutputLookup.has(node)) {
      // is a tail, I think this one may be redundant
      const poolId = reversePoolOutputLookup.get(node);
      if (poolId === undefined) {
        throw new Error('undefined poolId in reversePool');
      }
      if (!visitedPools.has(poolId)) {
        visitedPools.add(poolId);
        const start = poolInputs.get(poolId);
        const middle = poolIntermediates.get(poolId) || [];
        const end = poolOutputs.get(poolId);

        if (start === undefined) {
          throw new Error('PoolId ' + poolId + ' is undefined in start');
        }

        if (end === undefined) {
          throw new Error('PoolId ' + poolId + ' is undefined in start');
        }

        const startCluster = new SimpleCluster(start, false, true);
        const middleCluster = new SimpleCluster(middle, false, true);
        const endCluster = new SimpleCluster(end, false, true);

        const clusterChain = new ClusterChain(
          startCluster,
          middleCluster,
          endCluster
        );
        clusters.push(clusterChain);
      }
    }
  });

  return clusters;
};

export default generatePools;
