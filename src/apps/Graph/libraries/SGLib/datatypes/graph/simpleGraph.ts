import SimpleEdge from './simpleEdge';
import SimpleNode from './simpleNode';

export default class SimpleGraph {
  edges: Map<number, SimpleEdge> = new Map();
  nodes: Map<number, SimpleNode> = new Map();
  nodeLookup: Map<SimpleNode, number> = new Map();
  edgeLookup: Map<SimpleEdge, number> = new Map();
  orderedNodeArray: Array<SimpleNode>;

  constructor(nodes: Array<SimpleNode>) {
    this.orderedNodeArray = nodes;
    let edgeIndex: number = 0;
    let nodeIndex: number = 0;
    nodes.forEach(node => {
      this.nodes.set(nodeIndex, node);
      this.nodeLookup.set(node, nodeIndex++);
      Array.from(node.outputs.keys()).forEach(key => {
        this.edges.set(edgeIndex, key);
        this.edgeLookup.set(key, edgeIndex++);
      });
    });
  }
}
