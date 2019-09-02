import { getTranslate } from "react-localize-redux";
import {
  setGraphData,
  setGraphSourceNode,
  setMouseMode
} from "../../../../../redux/actions/Graph/graphActions";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { stringGen } from "../utils/stringUtils";
import * as d3 from "d3";
import MachineNode from "../datatypes/graph/graphNode";
import { GraphEdge } from "../datatypes/graph/graphEdge";
import GraphActionsBottomActions from "../../../components/GraphActionsBottomActions";
import clickPlugin from "./plugins/clickFunction";
import {
  dragDuringPlugin,
  dragEndPlugin,
  dragStartPlugin,
  dragSubjectPlugin
} from "./plugins/dragFunctions";
import zoomPlugin from "./plugins/zoomFunction";

if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackHooks: true
  });
}

function useBoundingBoxRect(props) {
  const [rect, setRect] = useState({
    width: 0,
    height: 0
  });

  const [canvasContainerCurrent, setCanvasContainerCurrent] = useState(null);
  const [canvasCurrent, setCanvasCurrent] = useState(null);

  const ref = useCallback(node => {
    setCanvasContainerCurrent(node);
  }, []);

  const canvasRef = useCallback(node => {
    setCanvasCurrent(node);
  }, []);

  const { heightOverride, widthOverride } = props;

  useEffect(
    () => {
      function measureElement() {
        if (canvasContainerCurrent) {
          const boundingRect = canvasContainerCurrent.getBoundingClientRect();
          if (canvasCurrent) {
            canvasCurrent.style.width =
              Math.round(widthOverride || rect.width) + "px";
            canvasCurrent.style.height =
              Math.round(heightOverride || rect.height) + "px";
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
      window.addEventListener("resize", measureElement, false);
      return () => window.removeEventListener("resize", measureElement, false);
    },
    [rect, canvasCurrent, canvasContainerCurrent, heightOverride, widthOverride]
  );

  const canvasContext = canvasCurrent ? canvasCurrent.getContext("2d") : null;

  return [rect, ref, canvasRef, canvasContext, canvasCurrent];
}

let transform = d3.zoomIdentity;

const setTransform = t => {
  transform = t;
};

function SGCanvasRefactored(props) {
  const {
    setGraphData,
    mouseMode,
    graphData,
    graphSourceNode,
    graphFidelity
  } = props;

  // Initial load on component
  useEffect(
    () => {
      const nodes = [];
      const edges = [];

      const num_nodes = 5;

      for (let i = 0; i < num_nodes; i++) {
        nodes.push(new MachineNode(0, 0, i * 300, 500));
      }

      for (let i = 0; i < num_nodes - 1; i++) {
        edges.push(new GraphEdge(nodes[i], nodes[i + 1]));
      }

      edges.push(new GraphEdge(nodes[0], nodes[1]));
      edges.push(new GraphEdge(nodes[1], nodes[3]));
      edges.push(new GraphEdge(nodes[1], nodes[3]));
      edges.push(new GraphEdge(nodes[3], nodes[4]));

      const data = {
        nodes: nodes,
        edges: edges
      };

      const nodeMapping = {};
      data.nodes.forEach(node => {
        nodeMapping[node.id] = node;
      });

      data.nodes.forEach(node => {
        node.sortSlots();
      });

      setGraphData(data);
    },
    [setGraphData]
  );

  const canvasId = useMemo(() => stringGen(10), []);
  const [
    rect,
    ref,
    canvasRef,
    canvasContext,
    canvasCurrent
  ] = useBoundingBoxRect(props);
  const ratio = window.devicePixelRatio || 1;
  const { heightOverride, widthOverride } = props;

  const selectedEdges = {};
  const selectedNodes = {};

  const dragStart = null;
  const dragCurrent = null;

  const graphEdges = graphData ? graphData.edges : null;
  const graphNodes = graphData ? graphData.nodes : null;

  const usedHeight = heightOverride || rect.height;
  const usedWidth = widthOverride || rect.width;

  const simulationUpdate = React.useCallback(
    (localTransform = transform) => {
      canvasContext.save();

      canvasContext.clearRect(0, 0, usedWidth, usedHeight);
      canvasContext.translate(localTransform.x, localTransform.y);

      canvasContext.save();
      canvasContext.lineCap = "round";

      canvasContext.globalAlpha = 1.0;
      canvasContext.scale(localTransform.k, localTransform.k);

      const selectedEdgesLength = Object.keys(selectedEdges).length;
      const selectedNodesLength = Object.keys(selectedNodes).length;

      Object.keys(selectedEdges).forEach(edgeId => {
        const edge = selectedEdges[edgeId];
        const startNode = edge.sourceNode;
        startNode.drawPathToTarget(canvasContext, edge);
      });

      if (selectedEdgesLength > 0 || selectedNodesLength > 0) {
        // Only make transparency if there are selected edges or nodes.
        canvasContext.globalAlpha = 0.2;
      }

      graphEdges.forEach(edge => {
        // Skip rendering this edge if we have already rendered;
        if (selectedEdges[edge.id]) return;
        const startNode = edge.sourceNode;
        startNode.drawPathToTarget(canvasContext, edge);
      });

      canvasContext.restore();

      canvasContext.globalAlpha = 1.0;

      canvasContext.save();

      const selectedNode = graphSourceNode;

      if (graphFidelity === "low") {
        canvasContext.scale(localTransform.k, localTransform.k);

        Object.keys(selectedNodes).forEach(nodeId => {
          const node = selectedNodes[nodeId];
          node.lowRender(canvasContext, selectedNode === node);
        });
      } else {
        Object.keys(selectedNodes).forEach(nodeId => {
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

      if (graphFidelity === "low") {
        canvasContext.scale(localTransform.k, localTransform.k);
        graphNodes.forEach(function(d) {
          d.lowRender(canvasContext, selectedNode === d);
        });
      } else {
        graphNodes.forEach(function(d) {
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
        canvasContext.fillStyle = "#FFA328";
        canvasContext.fillRect(x1, y1, x2 - x1, y2 - y1);

        canvasContext.setLineDash([8, 2]);
        canvasContext.strokeStyle = "#FFA328";
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
      usedWidth
    ]
  );

  const simulation = d3
    .forceSimulation()
    .force("center", d3.forceCenter(usedWidth / 2, usedHeight / 2))
    .force("x", d3.forceX(usedWidth / 2).strength(0.1))
    .force("y", d3.forceY(usedHeight / 2).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-50))
    .force(
      "link",
      d3
        .forceLink()
        .strength(1)
        .id(function(d) {
          return d.id;
        })
    )
    .alphaTarget(0)
    .alphaDecay(1);

  useEffect(
    () => {
      if (!canvasCurrent) return;
      d3.select(canvasCurrent)
        .call(
          d3
            .drag()
            .clickDistance(4)
            .subject(() => dragSubjectPlugin())
            .on("start", () => dragStartPlugin())
            .on("drag", () => dragDuringPlugin())
            .on("end", () => dragEndPlugin())
        )
        .on("click", function() {
          clickPlugin(this);
        })
        .call(
          d3
            .zoom()
            .filter(function() {
              if (mouseMode === "add") {
                return d3.event.type !== "dblclick";
              }

              return mouseMode !== "link";
            })
            .scaleExtent([1 / 10, 8])
            .on("zoom", () =>
              zoomPlugin(
                graphData,
                graphFidelity,
                mouseMode,
                setTransform,
                transform,
                simulationUpdate
              )
            )
        );
    },
    [canvasCurrent, graphData, graphFidelity, mouseMode, simulationUpdate]
  );

  useEffect(
    () => {
      if (!graphEdges || !graphNodes) return;

      simulation.nodes(graphNodes).on("tick", simulationUpdate);
      simulation.force("link").links(graphEdges);

      if (graphFidelity === "low") {
        graphNodes.forEach(node => {
          node.preRender(d3.zoomIdentity);
        });
      } else {
        graphNodes.forEach(node => {
          node.preRender(transform);
        });
      }
    },
    [graphEdges, graphFidelity, graphNodes, simulation, simulationUpdate]
  );

  // console.log(JSON.stringify({...props, graphNodes: []}));

  // console.log(props);
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
    display: "grid",
    gridArea: "canvasArea",
    gridTemplateAreas: `"canvasElement"`,
    gridTemplateRows: "minmax(0, 1fr)",
    gridTemplateColumns: "1fr",
    minWidth: 0,
    minHeight: 0,
    position: "relative"
  },
  canvas: {
    gridArea: "canvasElement",
    minWidth: 0,
    minHeight: 0
  }
});

SGCanvasRefactored.whyDidYouRender = true;

function mapStateToProps(state) {
  return {
    graphData: state.graphReducer.graphData,
    graphTransform: state.graphReducer.graphTransform,
    graphFidelity: state.graphReducer.graphFidelity,
    mouseMode: state.graphReducer.mouseMode,
    selectedMachine: state.graphReducer.selectedMachine,
    graphSourceNode: state.graphReducer.graphSourceNode,
    translate: getTranslate(state.localize)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
    setGraphSourceNode: data => dispatch(setGraphSourceNode(data)),
    setMouseMode: data => dispatch(setMouseMode(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SGCanvasRefactored));
