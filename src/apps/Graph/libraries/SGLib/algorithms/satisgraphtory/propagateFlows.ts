import ClusterChain from '../../datatypes/graph/clusterChain';
import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import SatisGraphtoryGroupNode from '../../datatypes/satisgraphtory/satisGraphtoryGroupNode';
import SimpleNode from '../../datatypes/graph/simpleNode';
import ResourceRate from '../../datatypes/primitives/resourceRate';

const propagateFlows = (clusters: Array<ClusterChain>) => {
  clusters.forEach(clusterChain => {
    // 1. Process the sources
    const sourceCluster = clusterChain.sources.orderedNodeArray;
    const intermediateCluster = clusterChain.intermediates.orderedNodeArray;
    const targetCluster = clusterChain.targets.orderedNodeArray;

    const redistribution: Map<SimpleNode, ResourceRate[]> = new Map();

    const nodeOrder = [
      ...sourceCluster,
      ...intermediateCluster,
      ...targetCluster
    ];

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
              if (redistribution.has(node)) {
                const arr = redistribution.get(node);
                if (arr === undefined) {
                  throw new Error('Arr is undefined');
                }

                arr.push(...distributeOutput.excess);
              } else {
                redistribution.set(node, [...distributeOutput.excess]);
              }
            }
          }
        }
      } else {
        throw new Error('Must be run through with the cyclic checker!');
      }
    });

    if (redistribution.size > 0) {
      redistribute(nodeOrder, redistribution);
    }
  });
};

const redistribute = (
  nodeOrder: Array<SimpleNode>,
  redistribution: Map<SimpleNode, ResourceRate[]>
) => {};

export default propagateFlows;
