import * as d3 from 'd3';
import MachineNode from '../../datatypes/graph/graphNode';
import { GraphEdge } from '../../datatypes/graph/graphEdge';

const canvasClickFunction = (
  graphSourceNode,
  setGraphSourceNode,
  translate,
  setGraphData,
  graphData,
  selectedMachine,
  setMouseMode,
  transform,
  setSelectedEdges,
  selectedNodes,
  setSelectedNodes,
  mouseMode,
  setNodesAndEdges
) => {
  if (d3.event.defaultPrevented) {
    return;
  }

  // Changed from x and y, because apparently they dont match up with the dragSubject???
  const x = transform.invertX(d3.event.offsetX);
  const y = transform.invertY(d3.event.offsetY);

  const selectedNodeKeys = Object.keys(selectedNodes);

  const localSelectedNodes = {};
  const localSelectedEdges = {};

  if (mouseMode === 'select') {
    // First, check the node clicking:

    const nodes = graphData.nodes;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.intersectsPoint(x, y)) {
        localSelectedNodes[node.id] = node;
        setSelectedNodes(localSelectedNodes);
        return;
      }
    }

    const innerCanvas = document.createElement('canvas');
    const innerContext = innerCanvas.getContext('2d');
    innerContext.canvas.width = 3;
    innerContext.canvas.height = 3;

    innerContext.translate(-x + 1, -y + 1);

    const edges = graphData.edges;

    for (let i = 0; i < edges.length; i++) {
      // console.time("paintCheck");
      const edge = edges[i];
      edge.paintEdge(innerContext);
      const innerData = innerContext.getImageData(1, 1, 1, 1).data;
      // console.timeEnd("paintCheck");
      if (innerData.every(item => item !== 0)) {
        localSelectedEdges[edge.id] = edge;
        setSelectedEdges(localSelectedEdges);
        return;
      }
    }

    setNodesAndEdges({}, {});
    setMouseMode('move');
    return;
  } else if (mouseMode === 'move' && selectedNodeKeys.length) {
    for (let i = 0; i < selectedNodeKeys.length; i++) {
      const node = selectedNodes[selectedNodeKeys[i]];
      if (node.intersectsPoint(x, y)) {
        return; // noop for now
      }
    }
  } else if (mouseMode === 'move') {
    // First, check the node clicking:

    const nodes = graphData.nodes;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.intersectsPoint(x, y)) {
        localSelectedNodes[node.id] = node;
        setSelectedNodes(localSelectedNodes);
        setMouseMode('select');
        return;
      }
    }

    const innerCanvas = document.createElement('canvas');
    const innerContext = innerCanvas.getContext('2d');
    innerContext.canvas.width = 3;
    innerContext.canvas.height = 3;

    innerContext.translate(-x + 1, -y + 1);

    const edges = graphData.edges;

    for (let i = 0; i < edges.length; i++) {
      // console.time("paintCheck");
      const edge = edges[i];
      edge.paintEdge(innerContext);
      const innerData = innerContext.getImageData(1, 1, 1, 1).data;
      // console.timeEnd("paintCheck");
      if (innerData.every(item => item !== 0)) {
        localSelectedEdges[edge.id] = edge;
        setSelectedEdges(localSelectedEdges);
        setMouseMode('select');
        return;
      }
    }
  }

  if (mouseMode === 'add' && selectedMachine) {
    const newGraph = Object.assign({}, graphData);

    // d3.event.x, y: d3.event.y

    newGraph.nodes.push(
      new MachineNode(selectedMachine, 0, x, y, true, translate, transform)
    );
    setGraphData(newGraph);
  } else if (mouseMode === 'link') {
    let selectedNode = null;

    let i;

    for (i = graphData.nodes.length - 1; i >= 0; --i) {
      const node = graphData.nodes[i];
      node.fx = node.x;
      node.fy = node.y;
    }

    for (i = graphData.nodes.length - 1; i >= 0; --i) {
      const node = graphData.nodes[i];
      if (node.intersectsPoint(x, y)) {
        selectedNode = node;
        break;
      }
    }

    if (graphSourceNode) {
      if (selectedNode) {
        if (graphSourceNode === selectedNode) {
          setGraphSourceNode(null);
        } else {
          try {
            const edge = new GraphEdge(graphSourceNode, selectedNode);
            graphData.edges.push(edge);
            setGraphData(graphData);
            setGraphSourceNode(null);
          } catch (e) {
            console.error('Output slot full!', e);
          }
        }
      } else {
        setGraphSourceNode(null);
      }
    } else {
      if (selectedNode) {
        setGraphSourceNode(selectedNode);
      }
    }
  }
};

export default canvasClickFunction;
