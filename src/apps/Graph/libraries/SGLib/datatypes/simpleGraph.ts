import SimpleEdge from './simpleEdge';
import SimpleNode from './simpleNode';

export default class SimpleGraph {
  edges: Array<SimpleEdge> = [];
  nodes: Array<SimpleNode> = [];

  addNode(node: SimpleNode) {
    this.nodes.push(node);
  }

  addEdge(edge: SimpleEdge) {
    this.edges.push(edge);
  }
}
