import * as d3 from 'd3';

export const dragStartPlugin = (
  simulation,
  transform,
  mouseMode,
  setDragStart
) => {
  // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  // const x = transform.invertX(d3.event.x);
  // const y = transform.invertY(d3.event.y);
  //
  // console.log(d3.event.x, d3.event.y, transform.invertX(d3.event.x), transform.invertY(d3.event.y), transform)
  //
  //
  // // Set the drag start
  // if (mouseMode === 'select') {
  //   setDragStart({ x: d3.event.x, y: d3.event.y, ex: x, ey: y });
  // }
  // subject.x = subject.fx;
  // subject.y = subject.fy;
  // subject.fx = transform.invertX(d3.event.x);
  // subject.fy = transform.invertY(d3.event.y);
};

export const dragDuringPlugin = (
  transform,
  mouseMode,
  setDragCurrent,
  selectedNodes
) => {
  const subject = d3.event.subject;

  // subject.fx = Math.floor(d3.event.dx / transform.k);
  // subject.fy += Math.floor(d3.event.dy / transform.k);
  //

  const initialX = transform.k * d3.event.x + transform.x;
  const initialY = transform.k * d3.event.y + transform.y;

  // subject.fx = transform.applyX(d3.event.x)
  //   // subject.fy = transform.applyY(d3.event.y)

  console.log('TRANSFORM', d3.event.x, d3.event.y);

  subject.fx = transform.invertX(transform.applyX(d3.event.x) / transform.k);
  subject.fy = transform.invertY(transform.applyY(d3.event.y) / transform.k);

  // const x = transform.invertX(d3.event.x);
  // const y = transform.invertY(d3.event.y);
  //
  // console.log(d3.event.x, d3.event.y, transform.invertX(d3.event.x), transform.invertY(d3.event.y))
  //
  //
  // if (mouseMode === 'select') {
  //   setDragCurrent({ x: d3.event.x, y: d3.event.y, ex: x, ey: y });
  // }
  //
  // const subject = d3.event.subject;
  //
  // if (subject instanceof GraphNode) {
  //   subject.fx = transform.invertX(d3.event.x);
  //   subject.fy = transform.invertY(d3.event.y);
  //   subject.sortSlots();
  //   subject.sortConnectedNodeSlots();
  // } else if (mouseMode !== 'select' && Object.keys(selectedNodes).length) {
  //   // It's a grouping of nodes
  //   Object.keys(selectedNodes).forEach(key => {
  //     const node = selectedNodes[key];
  //     node.fx = node.dx - (transform.invertX(subject.x) - transform.invertX(d3.event.x));
  //     node.fy = node.dy - (transform.invertY(subject.y) - transform.invertY(d3.event.y));
  //     node.sortSlots();
  //     node.sortConnectedNodeSlots();
  //   });
  // } else {
  //   subject.fx = x;
  //   subject.fy = y;
  // }
};

export const dragEndPlugin = (
  simulation,
  graphData,
  mouseMode,
  setDragStart,
  setDragCurrent,
  dragStart,
  dragCurrent,
  setSelectedNodes,
  setSelectedEdges
) => {
  // if (!d3.event.active) simulation.alphaTarget(0);
  //
  // if (mouseMode === 'select') {
  //   // TODO: Selection logic
  //
  //   const localSelectedNodes = {};
  //   const localSelectedEdges = {};
  //
  //   const x1 = dragStart.ex;
  //   const y1 = dragStart.ey;
  //   const x2 = (dragCurrent || dragStart).ex;
  //   const y2 = (dragCurrent || dragStart).ey;
  //
  //   graphData.nodes.forEach(node => {
  //     if (node.intersectsRect(x1, y1, x2, y2)) {
  //       localSelectedNodes[node.id] = node;
  //     }
  //   });
  //
  //   graphData.edges.forEach(edge => {
  //     if (edge.intersectsRect(x1, y1, x2, y2)) {
  //       localSelectedEdges[edge.id] = edge;
  //     }
  //   });
  //
  //   setSelectedNodes(localSelectedNodes);
  //   setSelectedEdges(localSelectedEdges);
  //
  //   setDragStart(null);
  //   setDragCurrent(null);
  //   return;
  // }
  //
  // setDragStart(null);
  // setDragCurrent(null);
  //
  // for (let i = graphData.nodes.length - 1; i >= 0; --i) {
  //   const node = graphData.nodes[i];
  //   node.x = node.fx;
  //   node.y = node.fy;
  // }
};

export const dragSubjectPlugin = (
  graphData,
  transform,
  mouseMode,
  selectedNodes,
  setSelectedNodes,
  setSelectedEdges
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
      node.x = node.fx;
      node.y = node.fy;
      node.dx = node.fx;
      node.dy = node.fy;
    }
  }

  if (draggingGroup) {
    return { x: d3.event.x, y: d3.event.y };
  }

  for (i = graphData.nodes.length - 1; i >= 0; --i) {
    const node = graphData.nodes[i];
    // node.fx = node.x;
    // node.fy = node.y;
  }

  for (i = graphData.nodes.length - 1; i >= 0; --i) {
    const node = graphData.nodes[i];
    if (node.intersectsPoint(x, y)) {
      // node.x =
      // node.y =
      console.log('TRANSFORM MEEEE', transform, node.x, node.y);
      node.fx = transform.applyX(node.x);
      node.fy = transform.applyY(node.y);
      setSelectedNodes({});
      setSelectedEdges({});
      return node;
    }
  }

  if (mouseMode === 'add') {
    return { x: d3.event.x, y: d3.event.y };
  }

  return null;
};
