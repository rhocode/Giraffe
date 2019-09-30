import { GraphNode } from '../datatypes/graph/graphNode';
import { GraphEdge } from '../datatypes/graph/graphEdge';

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export const removeEdges = (
  edges: GraphEdge[],
  graphData: GraphData
): GraphData => {
  const nodeSet: Set<GraphEdge> = new Set(edges);
  return {
    nodes: graphData.nodes,
    edges: graphData.edges.filter(item => !nodeSet.has(item))
  };
};

export const removeNodes = (
  nodes: GraphNode[],
  graphData: GraphData
): GraphData => {
  const nodeSet: Set<GraphNode> = new Set(nodes);

  const removedEdges: Set<GraphEdge> = new Set();
  nodes.forEach(node => {
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
  });

  console.error(nodeSet, removedEdges);

  return {
    nodes: graphData.nodes.filter(item => !nodeSet.has(item)),
    edges: graphData.edges.filter(item => !removedEdges.has(item))
  };
};
