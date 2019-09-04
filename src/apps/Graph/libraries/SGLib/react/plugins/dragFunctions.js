import * as d3 from 'd3';
import { GraphNode } from '../../datatypes/graph/graphNode';

export const dragStartPlugin = (
  simulation,
  transform,
  mouseMode,
  setDragStart
) => {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  const x = transform.invertX(d3.event.x);
  const y = transform.invertY(d3.event.y);
  d3.event.subject.fx = x;
  d3.event.subject.fy = y;

  // Set the drag start
  if (mouseMode === 'select') {
    setDragStart({ x: d3.event.x, y: d3.event.y, ex: x, ey: y });
  }
};

export const dragDuringPlugin = (
  transform,
  mouseMode,
  setDragCurrent,
  selectedNodes
) => {
  d3.event.subject.fx = transform.invertX(d3.event.x);
  d3.event.subject.fy = transform.invertY(d3.event.y);

  const x = transform.invertX(d3.event.x);
  const y = transform.invertY(d3.event.y);

  if (mouseMode === 'select') {
    setDragCurrent({ x: d3.event.x, y: d3.event.y, ex: x, ey: y });
  }

  const subject = d3.event.subject;

  if (subject instanceof GraphNode) {
    subject.fx = x;
    subject.fy = y;
    subject.sortSlots();
    subject.sortConnectedNodeSlots();
  } else if (mouseMode !== 'select' && Object.keys(selectedNodes).length) {
    // It's a grouping of nodes
    Object.keys(selectedNodes).forEach(key => {
      const node = selectedNodes[key];
      node.fx =
        node.dx -
        (transform.invertX(subject.x) - transform.invertX(d3.event.x));
      node.fy =
        node.dy -
        (transform.invertY(subject.y) - transform.invertY(d3.event.y));
      node.sortSlots();
      node.sortConnectedNodeSlots();
    });
  } else {
    subject.fx = x;
    subject.fy = y;
  }
};

export const dragEndPlugin = (
  simulation,
  graphData,
  mouseMode,
  setDragStart,
  setDragCurrent,
  dragStart,
  dragCurrent,
  setNodesAndEdges,
  transform,
  selectedNodes
) => {
  if (!d3.event.active) simulation.alphaTarget(0);

  if (mouseMode === 'select') {
    // TODO: Selection logic

    const x1 = dragStart.ex;
    const y1 = dragStart.ey;
    const x2 = (dragCurrent || dragStart).ex;
    const y2 = (dragCurrent || dragStart).ey;

    const localSelectedEdges = {};
    const localSelectedNodes = {};

    graphData.nodes.forEach(node => {
      if (node.intersectsRect(x1, y1, x2, y2)) {
        localSelectedNodes[node.id] = node;
      }
    });

    graphData.edges.forEach(edge => {
      if (edge.intersectsRect(x1, y1, x2, y2)) {
        localSelectedEdges[edge.id] = edge;
      }
    });

    setNodesAndEdges(localSelectedNodes, localSelectedEdges);

    setDragStart(null);
    setDragCurrent(null);
    return;
  }

  setDragStart(null);
  setDragCurrent(null);

  const node = d3.event.subject;

  node.x = transform.invertX(d3.event.x);
  node.y = transform.invertY(d3.event.y);

  node.fx = transform.invertX(d3.event.x);
  node.fy = transform.invertY(d3.event.y);

  Object.keys(selectedNodes).forEach(key => {
    const node = selectedNodes[key];
    node.x = node.fx;
    node.y = node.fy;
  });

  // todo; fix group dragging
  // for (let i = graphData.nodes.length - 1; i >= 0; --i) {
  //   const node = graphData.nodes[i];
  //   node.x = node.fx;
  //   node.y = node.fy;
  //
  // }
};

export const dragSubjectPlugin = (
  graphData,
  transform,
  mouseMode,
  selectedNodes,
  setNodesAndEdges
) => {
  if (mouseMode === 'link') {
    return null;
  }

  let i,
    x = transform.invertX(d3.event.x),
    y = transform.invertY(d3.event.y);

  if (mouseMode === 'select') {
    return { x: d3.event.x, y: d3.event.y };
  }

  const selectedNodeKeys = Object.keys(selectedNodes);

  let draggingGroup = false;

  if (mouseMode === 'move' && selectedNodeKeys.length) {
    for (i = 0; i < selectedNodeKeys.length; i++) {
      const node = selectedNodes[selectedNodeKeys[i]];
      if (node.intersectsPoint(x, y)) {
        draggingGroup = true;
      }
      node.x = transform.applyX(node.x);
      node.y = transform.applyY(node.y);
      node.fx = null;
      node.fy = null;
    }
  }

  if (draggingGroup) {
    return { x: d3.event.x, y: d3.event.y };
  }

  // for (i = graphData.nodes.length - 1; i >= 0; --i) {
  //   // const node = graphData.nodes[i];
  //   // node.fx = node.x;
  //   // node.fy = node.y;
  // }

  for (i = graphData.nodes.length - 1; i >= 0; --i) {
    const node = graphData.nodes[i];
    if (node.intersectsPoint(x, y)) {
      // node.x =
      // node.y =
      node.x = transform.applyX(node.x);
      node.y = transform.applyY(node.y);
      node.fx = null;
      node.fy = null;
      setNodesAndEdges({}, {});
      return node;
    }
  }

  if (mouseMode === 'add') {
    return { x: d3.event.x, y: d3.event.y };
  }

  return null;
};
