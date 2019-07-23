import SimpleNode from './simpleNode';

export default class SimpleCluster {
  nodes: Array<SimpleNode>;
  sourceNode: SimpleNode;
  targetNode: SimpleNode;

  constructor(nodes: Array<SimpleNode>) {
    this.nodes = nodes;

    // TODO: Fix this calculation. Ideally, we should be adding a source and a sink with infinite capacity if there
    // is multiple.
    this.sourceNode = nodes[0];
    this.targetNode = nodes[nodes.length - 1];
  }
}
