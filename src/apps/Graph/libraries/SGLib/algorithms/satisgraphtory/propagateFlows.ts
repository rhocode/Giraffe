import ClusterChain from '../../datatypes/graph/clusterChain';
import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import SatisGraphtoryGroupNode from '../../datatypes/satisgraphtory/satisGraphtoryGroupNode';
import SimpleNode from '../../datatypes/graph/simpleNode';
import ResourceRate from '../../datatypes/primitives/resourceRate';
import SimpleEdge from '../../datatypes/graph/simpleEdge';
import Belt from '../../datatypes/satisgraphtory/belt';

function distribute(nodeOrder: Array<SimpleNode>) {
  const redistribution: Map<SimpleEdge, ResourceRate[]> = new Map();

  nodeOrder.forEach(node => {
    if (node instanceof GroupNode) {
      const groupNode = node as GroupNode;
      groupNode.visited = false;
    } else {
      throw new Error('Must be run through with the cyclic checker!');
    }
  });

  nodeOrder.forEach(node => {
    if (node instanceof GroupNode) {
      const groupNode = node as GroupNode;
      if (!groupNode.visited) {
        groupNode.visited = true;

        if (node.isCyclic()) {
          node.cyclicNodes().forEach(node => {
            if (!(node instanceof SatisGraphtoryAbstractNode)) {
              throw new Error('Not the right kind of node');
            }
            // perform propagation analysis on this node!
            // needs a cyclic helper analysis on this!
          });

          const castedNode = new SatisGraphtoryGroupNode(groupNode);

          castedNode.processInputs();
          castedNode.distributeOutputs();

          // const castedNode = innerNode as SatisGraphtoryAbstractNode;
        } else {
          const innerNode = node.singleNode();
          if (!(innerNode instanceof SatisGraphtoryAbstractNode)) {
            throw new Error('Not the right kind of node');
          }

          const castedNode = innerNode as SatisGraphtoryAbstractNode;
          castedNode.processInputs();

          //TODO: IF THIS NODE IS A PART OF targetCluster, DO NOT!!!!!!!!!!!!!!!!!!! DISTRI BYTE OUTPUTS

          const distributeOutput = castedNode.distributeOutputs();

          if (distributeOutput && distributeOutput.hasExcess()) {
            Array.from(distributeOutput.excess.entries()).forEach(entry => {
              const edge = entry[0];
              const resources = entry[1];
              if (redistribution.has(edge)) {
                const arr = redistribution.get(edge);
                if (arr === undefined) {
                  throw new Error('Arr is undefined');
                }

                arr.push(...resources);
              } else {
                redistribution.set(edge, [...resources]);
              }
            });
          }
        }
      }
    }
  });

  return redistribution;
}

const propagateFlows = (clusters: Array<ClusterChain>) => {
  let repropagateFlows = false;
  let redistribution = new Map();
  let i = 0;
  do {
    repropagateFlows = false;
    for (let i = 0; i < clusters.length; i++) {
      // 1. Process the sources
      const clusterChain = clusters[i];
      const sourceCluster = clusterChain.sources
        .orderedNodeArray as GroupNode[];
      const intermediateCluster = clusterChain.intermediates
        .orderedNodeArray as GroupNode[];
      const targetCluster = clusterChain.targets
        .orderedNodeArray as GroupNode[];

      const nodeOrder = [
        ...sourceCluster,
        ...intermediateCluster,
        ...targetCluster
      ];

      const allNodeSet = new Set([
        ...sourceCluster.map(cluster => cluster.subNodes).flat(1),
        ...intermediateCluster.map(cluster => cluster.subNodes).flat(1),
        ...targetCluster.map(cluster => cluster.subNodes).flat(1)
      ]);

      let shouldRedistribute = false;
      do {
        if (redistribution.size > 0) {
          redistribute(nodeOrder, redistribution);
        }
        redistribution = distribute(nodeOrder);

        shouldRedistribute =
          redistribution.size > 0 &&
          Array.from(redistribution.keys()).some(edge => {
            const node = edge.source;
            return allNodeSet.has(node);
          });
        repropagateFlows =
          redistribution.size > 0 &&
          Array.from(redistribution.keys()).some(edge => {
            const node = edge.source;
            return !allNodeSet.has(node);
          });

        // if (i++ === 3) {
        //   break;
        // }
      } while (shouldRedistribute);
    }
    // if (i++ === 3) {
    //   break;
    // }
  } while (repropagateFlows);
};

const backPropagation = (
  terminalSet: Set<SimpleNode>,
  edge: SimpleEdge,
  resourceRates: ResourceRate[]
) => {
  const node = edge.target;

  if (!(node instanceof GroupNode)) {
    throw new Error('Not a groupNode');
  }

  if (terminalSet.has(node)) {
    return;
    // ??? should we actually do anything
  }

  if (node.isCyclic()) {
    const castedNode = new SatisGraphtoryGroupNode(node);
    castedNode.backPropagation(resourceRates, edge);
  } else {
    const innerNode = node.singleNode();
    if (!(innerNode instanceof SatisGraphtoryAbstractNode)) {
      throw new Error('Not the right kind of node');
    }

    const castedNode = innerNode as SatisGraphtoryAbstractNode;
    castedNode.backPropagation(resourceRates, edge);

    //TODO: Fix the backprop here too
  }
};

const redistribute = (
  nodeOrder: Array<SimpleNode>,
  redistribution: Map<SimpleEdge, ResourceRate[]>
) => {
  Array.from(redistribution.entries()).forEach(entry => {
    const edge = entry[0];
    if (!(edge instanceof Belt)) {
      throw new Error('This is not a belt!');
    }

    edge.reduceClampFlow(entry[1]);

    // May have to revisit in the future. for now, let's do a shitty backprop using iterative methods.
    // backPropagation(terminal, entry[0], entry[1]);
  });
};

export default propagateFlows;
