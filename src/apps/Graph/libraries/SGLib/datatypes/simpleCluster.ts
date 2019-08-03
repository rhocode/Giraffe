import SimpleNode from './simpleNode';
import { stronglyConnectedComponents } from '../algorithms/stronglyConnectedComponents';
import GroupNode from './groupNode';
import SimpleGraph from './simpleGraph';

type Nullable<T> = T | null;

export default class SimpleCluster extends SimpleGraph {
  sourceNode: SimpleNode;
  targetNode: SimpleNode;
  nonCyclic: boolean;

  constructor(nodes: Array<SimpleNode>, cyclic: Nullable<boolean> = null) {
    super(nodes);
    // TODO: Fix this calculation. Ideally, we should be adding a source and a sink with infinite capacity if there
    // is multiple.
    this.sourceNode = nodes[0];
    this.targetNode = nodes[nodes.length - 1];

    if (cyclic === null) {
      const components = stronglyConnectedComponents(this);
      this.nonCyclic = components.filter(item => item.length > 1).length === 0;
    } else {
      this.nonCyclic = cyclic;
    }
  }
  generateNonCyclicCluster() {
    const nodeGroups = stronglyConnectedComponents(this);

    const nodeArray: Array<SimpleNode> = [];

    const nodeMapping: Map<number, GroupNode> = new Map();

    nodeGroups.forEach(group => {
      const mappedNodes = group
        .map(node => this.nodes.get(node))
        .filter(item => item !== undefined);
      const newGroupNode = new GroupNode(mappedNodes as Array<SimpleNode>);
      group.forEach(nodeIndex => {
        nodeMapping.set(nodeIndex, newGroupNode);
      });

      nodeArray.push(newGroupNode);
    });

    this.nodes.forEach(node => {
      Array.from(node.outputs.entries()).forEach(outputs => {
        const targetNode = outputs[1];
        const sourceNodeIndex = this.nodeLookup.get(node);
        const targetNodeIndex = this.nodeLookup.get(targetNode);

        if (sourceNodeIndex === undefined || targetNodeIndex === undefined) {
          throw new Error('source or target node is undefined');
        }

        const groupNodeSource = nodeMapping.get(sourceNodeIndex);
        const groupNodeTarget = nodeMapping.get(targetNodeIndex);

        if (groupNodeSource === undefined || groupNodeTarget === undefined) {
          throw new Error('source or target group node is undefined');
        }

        if (groupNodeSource !== groupNodeTarget) {
          groupNodeSource.addOutput(groupNodeTarget, true);
        }
      });
    });

    return new SimpleCluster(nodeArray);
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
