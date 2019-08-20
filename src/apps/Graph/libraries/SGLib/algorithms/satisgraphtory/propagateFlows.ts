import ClusterChain from '../../datatypes/graph/clusterChain';
import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import SatisGraphtoryGroupNode from '../../datatypes/satisgraphtory/satisGraphtoryGroupNode';
import SimpleNode from '../../datatypes/graph/simpleNode';
import ResourceRate from '../../datatypes/primitives/resourceRate';
import SimpleEdge from '../../datatypes/graph/simpleEdge';

function distribute(nodeOrder: Array<SimpleNode>) {
  const redistribution: Map<SimpleEdge, ResourceRate[]> = new Map();

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
    } else {
      throw new Error('Must be run through with the cyclic checker!');
    }
  });

  return redistribution;
}

const propagateFlows = (clusters: Array<ClusterChain>) => {
  clusters.forEach(clusterChain => {
    // 1. Process the sources
    const sourceCluster = clusterChain.sources.orderedNodeArray;
    const intermediateCluster = clusterChain.intermediates.orderedNodeArray;
    const targetCluster = clusterChain.targets.orderedNodeArray;

    const nodeOrder = [
      ...sourceCluster,
      ...intermediateCluster,
      ...targetCluster
    ];

    console.error(
      'Nodes in this cluster:',
      sourceCluster.length,
      intermediateCluster.length,
      targetCluster.length
    );

    const initialDistribution = distribute(nodeOrder);

    const sourceSet = new Set(sourceCluster);

    let shouldRedistribute =
      initialDistribution.size > 0 &&
      Array.from(initialDistribution.keys()).some(node => {
        return !sourceSet.has(node);
      });

    let redistribution = initialDistribution;

    while (shouldRedistribute) {
      if (redistribution.size > 0) {
        redistribute(sourceCluster, nodeOrder, redistribution);
      }

      redistribution = distribute(nodeOrder);

      shouldRedistribute =
        redistribution.size > 0 &&
        Array.from(redistribution.keys()).some(node => {
          return !sourceSet.has(node);
        });

      break;
    }
  });
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
    castedNode.backPropagation(resourceRates);
  } else {
    const innerNode = node.singleNode();
    if (!(innerNode instanceof SatisGraphtoryAbstractNode)) {
      throw new Error('Not the right kind of node');
    }

    const castedNode = innerNode as SatisGraphtoryAbstractNode;
    castedNode.backPropagation(resourceRates);

    //TODO: Fix the backprop here too
  }
};

const redistribute = (
  sources: Array<SimpleNode>,
  nodeOrder: Array<SimpleNode>,
  redistribution: Map<SimpleEdge, ResourceRate[]>
) => {
  const terminal = new Set(sources);
  Array.from(redistribution.entries()).forEach(entry => {
    backPropagation(terminal, entry[0], entry[1]);
  });
};

export default propagateFlows;
