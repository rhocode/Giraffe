import SimpleNode from './simpleNode';
import SimpleEdge from './simpleEdge';

export default class SimpleCluster {
  sourceNode: SimpleNode;
  targetNode: SimpleNode;
  edges: Map<number, SimpleEdge> = new Map();
  nodes: Map<number, SimpleNode> = new Map();
  nodeLookup: Map<SimpleNode, number> = new Map();
  edgeLookup: Map<SimpleEdge, number> = new Map();
  constructor(nodes: Array<SimpleNode>) {
    // TODO: Fix this calculation. Ideally, we should be adding a source and a sink with infinite capacity if there
    // is multiple.
    this.sourceNode = nodes[0];
    this.targetNode = nodes[nodes.length - 1];

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

  generateSimpleGraph() {
    const adjacencyMap: Map<number, Map<number, number>> = new Map();

    Array.from(this.edges.values()).forEach(edge => {
      const sourceNode = edge.source;
      const targetNode = edge.target;
      const weight = edge.weight;

      const sourceIndex = this.nodeLookup.get(sourceNode) || 0;
      const targetIndex = this.nodeLookup.get(targetNode) || 0;

      if (adjacencyMap.get(sourceIndex) === undefined) {
        adjacencyMap.set(sourceIndex, new Map());
      }
      (adjacencyMap.get(sourceIndex) as any).set(targetIndex, weight);
    });

    return {
      s: this.nodeLookup.get(this.sourceNode) || 0,
      t: this.nodeLookup.get(this.targetNode) || 0,
      graph: adjacencyMap
    };
  }
}
