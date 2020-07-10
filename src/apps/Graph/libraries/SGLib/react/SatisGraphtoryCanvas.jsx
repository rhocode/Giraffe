import { getTranslate } from 'react-localize-redux';
import {
  setDataLibrary,
  setGraphData,
  setGraphSourceNode,
  setMouseMode,
  setSelectedData,
} from '../../../../../redux/actions/Graph/graphActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { stringGen } from '../utils/stringUtils';
import * as d3 from 'd3';
import GraphActionsBottomActions from '../../../components/GraphActionsBottomActions';
import clickPlugin from './plugins/clickFunction';
import {
  dragDuringPlugin,
  dragEndPlugin,
  dragStartPlugin,
  dragSubjectPlugin,
} from './plugins/dragFunctions';
import zoomPlugin from './plugins/zoomFunction';

import { setEquals } from '../utils/sets';
import hydrate from '../algorithms/satisgraphtory/hydrate';
import { maxCanvasRatio } from '../datatypes/graph/graphNode';
import setEnums from '../repositories/objectRepository';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';

function useBoundingBoxRect(props) {
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  });

  const [canvasContainerCurrent, setCanvasContainerCurrent] = useState(null);
  const [canvasCurrent, setCanvasCurrent] = useState(null);

  const ref = useCallback((node) => {
    setCanvasContainerCurrent(node);
  }, []);

  const canvasRef = useCallback((node) => {
    setCanvasCurrent(node);
  }, []);

  const { heightOverride, widthOverride } = props;

  useEffect(() => {
    function measureElement() {
      if (canvasContainerCurrent) {
        const boundingRect = canvasContainerCurrent.getBoundingClientRect();
        if (canvasCurrent) {
          canvasCurrent.style.width =
            Math.round(widthOverride || rect.width) + 'px';
          canvasCurrent.style.height =
            Math.round(heightOverride || rect.height) + 'px';
        }
        if (
          boundingRect.width !== rect.width ||
          boundingRect.height !== rect.height
        ) {
          setRect(boundingRect);
        }
      }
    }

    measureElement();
    window.addEventListener('resize', measureElement, false);
    return () => window.removeEventListener('resize', measureElement, false);
  }, [
    rect,
    canvasCurrent,
    canvasContainerCurrent,
    heightOverride,
    widthOverride,
  ]);

  const canvasContext = canvasCurrent ? canvasCurrent.getContext('2d') : null;

  return [rect, ref, canvasRef, canvasContext, canvasCurrent];
}

let transform = d3.zoomIdentity;

const setTransform = (t) => {
  transform = t;
};

let dragStart = null;

const setDragStart = (t) => {
  dragStart = t;
};

let dragCurrent = null;

const setDragCurrent = (t) => {
  dragCurrent = t;
};

let didDrag = false;

const setDidDrag = (t) => {
  didDrag = t;
};

function SatisGraphtoryCanvas(props) {
  const {
    setGraphData,
    mouseMode,
    graphData,
    graphSourceNode,
    graphFidelity,
    translate,
    selectedMachine,
    setGraphSourceNode,
    setMouseMode,
    initialLoadedData,
    heightOverride,
    widthOverride,
    setSelectedDataFunc,
    selectedData,
    refreshGraphData,
    setDataLibrary,
    dataLibrary,
  } = props;

  // Initial load on component
  useEffect(() => {
    hydrate(initialLoadedData, translate, transform, (data) => {
      setGraphData(data);
    });
    setEnums(setDataLibrary);
  }, [initialLoadedData, setDataLibrary, setGraphData, translate]);

  const canvasId = useMemo(() => stringGen(10), []);
  const [
    rect,
    ref,
    canvasRef,
    canvasContext,
    canvasCurrent,
  ] = useBoundingBoxRect(props);
  const ratio = sgDevicePixelRatio;

  const selectedNodes = selectedData.nodes || {};
  const selectedEdges = selectedData.edges || {};

  const setSelectedEdges = React.useCallback(
    (edges) => {
      const oldSet = new Set(Object.keys(selectedData.edges || {}));
      const newSet = new Set(Object.keys(edges));
      if (!setEquals(oldSet, newSet)) {
        const newData = { ...selectedData };

        newData['edges'] = { ...edges };

        setSelectedDataFunc(newData);
      }
    },
    [selectedData, setSelectedDataFunc]
  );

  const setSelectedNodes = React.useCallback(
    (nodes) => {
      const oldSet = new Set(Object.keys(selectedData.nodes || {}));
      const newSet = new Set(Object.keys(nodes));
      if (!setEquals(oldSet, newSet)) {
        const newData = { ...selectedData };

        newData['nodes'] = { ...nodes };

        setSelectedDataFunc(newData);
      }
    },
    [selectedData, setSelectedDataFunc]
  );

  const setNodesAndEdges = React.useCallback(
    (nodes, edges) => {
      const oldNodeSet = new Set(Object.keys(selectedData.nodes || {}));
      const newNodeSet = new Set(Object.keys(nodes));

      const oldEdgeSet = new Set(Object.keys(selectedData.edges || {}));
      const newEdgeSet = new Set(Object.keys(edges));

      let nodesChanged = false;
      let edgesChanged = false;

      if (!setEquals(oldNodeSet, newNodeSet)) {
        nodesChanged = true;
      }

      if (!setEquals(oldEdgeSet, newEdgeSet)) {
        edgesChanged = true;
      }

      if (nodesChanged || edgesChanged) {
        const newData = { ...selectedData };

        if (nodesChanged) {
          newData['nodes'] = { ...nodes };
        }

        if (edgesChanged) {
          newData['edges'] = { ...edges };
        }

        setSelectedDataFunc(newData);
      }
    },
    [selectedData, setSelectedDataFunc]
  );

  const graphEdges = graphData ? graphData.edges : null;
  const graphNodes = graphData ? graphData.nodes : null;

  const usedHeight = heightOverride || rect.height;
  const usedWidth = widthOverride || rect.width;

  const simulationUpdate = React.useCallback(
    (localTransform = transform) => {
      if (!canvasContext) return;
      canvasContext.save();

      canvasContext.clearRect(0, 0, usedWidth, usedHeight);
      canvasContext.translate(localTransform.x, localTransform.y);

      canvasContext.save();
      canvasContext.lineCap = 'round';

      canvasContext.globalAlpha = 1.0;
      canvasContext.scale(localTransform.k, localTransform.k);

      const selectedEdgesLength = Object.keys(selectedEdges).length;
      const selectedNodesLength = Object.keys(selectedNodes).length;

      Object.keys(selectedEdges).forEach((edgeId) => {
        const edge = selectedEdges[edgeId];
        const startNode = edge.source;
        startNode.drawEdgePath(canvasContext, edge);
      });

      if (selectedEdgesLength > 0 || selectedNodesLength > 0) {
        // Only make transparency if there are selected edges or nodes.
        canvasContext.globalAlpha = 0.2;
      }

      graphEdges.forEach((edge) => {
        // Skip rendering this edge if we have already rendered;
        if (selectedEdges[edge.id]) return;
        const startNode = edge.source;
        startNode.drawEdgePath(canvasContext, edge);
      });

      canvasContext.restore();

      canvasContext.globalAlpha = 1.0;

      canvasContext.save();

      const selectedNode = graphSourceNode;

      if (graphFidelity === 'low') {
        canvasContext.scale(localTransform.k, localTransform.k);

        Object.keys(selectedNodes).forEach((nodeId) => {
          const node = selectedNodes[nodeId];
          node.lowRender(canvasContext, selectedNode === node);
        });
      } else {
        Object.keys(selectedNodes).forEach((nodeId) => {
          const node = selectedNodes[nodeId];
          node.render(canvasContext, localTransform, selectedNode === node);
        });
      }

      canvasContext.restore();

      if (selectedEdgesLength > 0 || selectedNodesLength > 0) {
        // Only make transparency if there are selected edges or nodes.
        canvasContext.globalAlpha = 0.2;
      }

      canvasContext.save();

      if (graphFidelity === 'low') {
        canvasContext.scale(localTransform.k, localTransform.k);
        graphNodes.forEach(function (d) {
          // console.log("LOWRENDERED");
          d.lowRender(canvasContext, selectedNode === d);
        });
      } else {
        graphNodes.forEach(function (d) {
          // console.log("HIGHRENDERED");
          d.render(canvasContext, localTransform, selectedNode === d);
        });
      }
      canvasContext.restore();

      canvasContext.restore();
      canvasContext.save();
      // Draw selection rect
      if (dragStart && dragCurrent) {
        const x1 = dragStart.x;
        const y1 = dragStart.y;
        const x2 = dragCurrent.x;
        const y2 = dragCurrent.y;

        canvasContext.globalAlpha = 0.15;
        canvasContext.fillStyle = '#FFA328';
        canvasContext.fillRect(x1, y1, x2 - x1, y2 - y1);

        canvasContext.setLineDash([8, 2]);
        canvasContext.strokeStyle = '#FFA328';
        canvasContext.globalAlpha = 1.0;

        canvasContext.strokeRect(x1, y1, x2 - x1, y2 - y1);
      }
      canvasContext.restore();
    },
    [
      canvasContext,
      graphEdges,
      graphFidelity,
      graphNodes,
      graphSourceNode,
      selectedEdges,
      selectedNodes,
      usedHeight,
      usedWidth,
    ]
  );

  const simulation = d3
    .forceSimulation()
    .force('center', d3.forceCenter(usedWidth / 2, usedHeight / 2))
    .force('x', d3.forceX(usedWidth / 2).strength(0.1))
    .force('y', d3.forceY(usedHeight / 2).strength(0.1))
    .force('charge', d3.forceManyBody().strength(-50))
    .force(
      'link',
      d3
        .forceLink()
        .strength(1)
        .id(function (d) {
          return d.id;
        })
    )
    .alphaDecay(1);

  useEffect(() => {
    simulation.restart();
    simulation.alphaDecay(1);
  }, [graphFidelity, simulation, selectedEdges, selectedNodes, graphData]);

  // useEffect(() => {
  //   if (graphData) {
  //     transformGraph(graphData, () => {
  //       forceRefreshGraph();
  //       // console.error("AAAAAAAAA");
  //     });
  //   }
  // }, [forceRefreshGraph, graphData]);

  useEffect(() => {
    if (!canvasCurrent) return;

    let dragDistance = 10;

    if (mouseMode === 'add') {
      dragDistance = 200;
    }

    d3.select(canvasCurrent)
      .call(
        d3
          .drag()
          .container(canvasCurrent)
          .clickDistance(dragDistance)
          .subject(() =>
            dragSubjectPlugin(
              graphData,
              transform,
              mouseMode,
              selectedNodes,
              setNodesAndEdges
            )
          )
          .on('start', () =>
            dragStartPlugin(simulation, transform, mouseMode, setDragStart)
          )
          .on('drag', () =>
            dragDuringPlugin(
              transform,
              mouseMode,
              setDragCurrent,
              selectedNodes,
              setDidDrag
            )
          )
          .on('end', () =>
            dragEndPlugin(
              simulation,
              graphData,
              mouseMode,
              setDragStart,
              setDragCurrent,
              dragStart,
              dragCurrent,
              setNodesAndEdges,
              transform,
              selectedNodes,
              didDrag,
              setDidDrag
            )
          )
      )
      .on('click', () =>
        clickPlugin(
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
        )
      )
      .call(
        d3
          .zoom()
          .filter(function () {
            if (mouseMode === 'add') {
              return d3.event.type !== 'dblclick';
            }

            return mouseMode !== 'link';
          })
          .scaleExtent([1 / 10, maxCanvasRatio])
          .on('zoom', () =>
            zoomPlugin(
              graphData,
              graphFidelity,
              mouseMode,
              setTransform,
              transform,
              simulationUpdate,
              dataLibrary
            )
          )
      );
  }, [
    canvasCurrent,
    dataLibrary,
    graphData,
    graphFidelity,
    graphSourceNode,
    mouseMode,
    selectedMachine,
    selectedNodes,
    setGraphData,
    setGraphSourceNode,
    setMouseMode,
    setNodesAndEdges,
    setSelectedEdges,
    setSelectedNodes,
    simulation,
    simulationUpdate,
    translate,
  ]);

  useEffect(() => {
    if (!graphEdges || !graphNodes) return;
    simulation.nodes(graphNodes).on('tick', simulationUpdate);
    simulation.force('link').links(graphEdges);

    if (graphFidelity === 'low') {
      graphNodes.forEach((node) => {
        node.preRender(d3.zoomIdentity, dataLibrary);
      });
    } else {
      graphNodes.forEach((node) => {
        node.preRender(transform, dataLibrary);
      });
    }
  }, [
    graphEdges,
    graphFidelity,
    graphNodes,
    simulation,
    simulationUpdate,
    refreshGraphData,
    dataLibrary,
  ]);

  return (
    <div ref={ref} className={props.classes.canvasContainer}>
      <canvas
        id={canvasId}
        className={props.classes.canvas}
        ref={canvasRef}
        height={usedHeight * ratio}
        width={usedWidth * ratio}
      />
      <GraphActionsBottomActions />
    </div>
  );
}

const styles = () => ({
  canvasContainer: {
    display: 'grid',
    gridArea: 'contentArea',
    gridTemplateAreas: `"canvasElement"`,
    gridTemplateRows: 'minmax(0, 1fr)',
    gridTemplateColumns: '1fr',
    minWidth: 0,
    minHeight: 0,
    position: 'relative',
  },
  canvas: {
    gridArea: 'canvasElement',
    minWidth: 0,
    minHeight: 0,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

function mapStateToProps(state) {
  return {
    graphData: state.graphReducer.graphData,
    graphFidelity: state.graphReducer.graphFidelity,
    mouseMode: state.graphReducer.mouseMode,
    selectedMachine: state.graphReducer.selectedMachine,
    graphSourceNode: state.graphReducer.graphSourceNode,
    selectedData: state.graphReducer.selectedData,
    initialLoadedData: state.graphReducer.initialLoadedData,
    refreshGraphData: state.graphReducer.__toggledState,
    translate: getTranslate(state.localize),
    dataLibrary: state.graphReducer.dataLibrary,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: (data) => dispatch(setGraphData(data)),
    setGraphSourceNode: (data) => dispatch(setGraphSourceNode(data)),
    setMouseMode: (data) => dispatch(setMouseMode(data)),
    setSelectedDataFunc: (data) => dispatch(setSelectedData(data)),
    setDataLibrary: (data) => dispatch(setDataLibrary(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SatisGraphtoryCanvas));
