import ClusterChain from '../../datatypes/graph/clusterChain';
import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';

const propagateFlows = (clusters: Array<ClusterChain>) => {
  clusters.forEach(clusterChain => {
    // 1. Process the sources
    const sourceCluster = clusterChain.sources.orderedNodeArray;
    const intermediateCluster = clusterChain.intermediates.orderedNodeArray;
    const targetCluster = clusterChain.targets.orderedNodeArray;

    [...sourceCluster, ...intermediateCluster, ...targetCluster].forEach(
      node => {
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

              // const castedNode = innerNode as SatisGraphtoryAbstractNode;
            } else {
              const innerNode = node.singleNode();
              if (!(innerNode instanceof SatisGraphtoryAbstractNode)) {
                throw new Error('Not the right kind of node');
              }

              const castedNode = innerNode as SatisGraphtoryAbstractNode;
              castedNode.processInputs();
              castedNode.distributeOutputs();
            }
          }
        } else {
          throw new Error('Must be run through with the cyclic checker!');
        }
      }
    );
  });
};

export default propagateFlows;
