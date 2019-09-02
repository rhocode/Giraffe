import { GraphNode } from '../datatypes/graph/graphNode';
import { GraphEdge } from '../datatypes/graph/graphEdge';

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export const removeEdge = (
  edge: GraphEdge,
  graphData: GraphData
): GraphData => {
  return {
    nodes: graphData.nodes,
    edges: graphData.edges.filter(item => item !== edge)
  };
};

export const removeNode = (
  node: GraphNode,
  graphData: GraphData
): GraphData => {
  const removedEdges: Set<GraphEdge> = new Set();
  node.outputSlots.forEach(item => {
    if (item !== null) {
      removedEdges.add(item);
    }
  });
  node.inputSlots.forEach(item => {
    if (item !== null) {
      removedEdges.add(item);
    }
  });

  return {
    nodes: graphData.nodes.filter(item => item !== node),
    edges: graphData.edges.filter(item => !removedEdges.has(item))
  };
};
