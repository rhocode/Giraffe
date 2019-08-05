import SimpleNode from './simpleNode';
import { stronglyConnectedComponents } from '../algorithms/stronglyConnectedComponents';
import GroupNode from './groupNode';
import SimpleGraph from './simpleGraph';

type Nullable<T> = T | null;

export default class SimpleCluster extends SimpleGraph {
  sourceNode: SimpleNode;
  targetNode: SimpleNode;
  nonCyclic: boolean;
  partial: boolean;

  constructor(
    nodes: Array<SimpleNode>,
    cyclic: Nullable<boolean> = null,
    partial = false
  ) {
    super(nodes);
    // TODO: Fix this calculation. Ideally, we should be adding a source and a sink with infinite capacity if there
    // is multiple.

    const theseNodes = new Set(nodes);

    const inputs = nodes.filter(node => {
      return (
        Array.from(node.inputs.values()).filter(subNode =>
          theseNodes.has(subNode)
        ).length === 0
      );
    });

    const outputs = nodes.filter(node => {
      return (
        Array.from(node.outputs.values()).filter(subNode =>
          theseNodes.has(subNode)
        ).length === 0
      );
    });

    if (inputs.length === 0) {
      throw new Error('No inputs found!');
    }

    if (outputs.length === 0) {
      throw new Error('No inputs found!');
    }

    if (inputs.length === 1) {
      this.sourceNode = inputs[0];
    } else {
      this.sourceNode = new SimpleNode(null, true);
      inputs.forEach(input => {
        this.sourceNode.addOutput(input);
      });
    }

    if (outputs.length === 1) {
      this.targetNode = outputs[0];
    } else {
      this.targetNode = new SimpleNode(null, true);
      outputs.forEach(output => {
        this.targetNode.addInput(output);
      });
    }

    this.partial = partial;

    if (cyclic === null) {
      if (nodes.length > 0 && !partial) {
        const components = stronglyConnectedComponents(this);
        this.nonCyclic =
          components.filter(item => item.length > 1).length === 0;
      } else {
        this.nonCyclic = true;
      }
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
