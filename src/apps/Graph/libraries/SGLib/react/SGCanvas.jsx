import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { stringGen } from '../utils/stringUtils';
import MachineNode, { GraphNode } from '../datatypes/graph/graphNode';
import {
  setGraphData,
  setGraphSourceNode,
  setMouseMode
} from '../../../../../redux/actions/Graph/graphActions';
import { GraphEdge } from '../datatypes/graph/graphEdge';
import { withStyles } from '@material-ui/core';
import { getTranslate } from 'react-localize-redux';
import { defaultMachineObjectMock } from '../../../../../mocks/dataMocks';

const styles = () => ({
  canvas: {
    gridArea: 'canvasElement',
    minWidth: 0,
    minHeight: 0
  }
});

class SGCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasId = stringGen(10);

    this.transform = d3.zoomIdentity;
    this.state = {
      loaded: false
    };
    this.k = 1;
    this.selectedNodes = {};
    this.selectedEdges = {};
    this.initialized = false;
  }

  componentDidMount() {
    const width = this.props.width;
    const height = this.props.height;

    this.graphCanvas = d3.select('#' + this.canvasId).node();

    this.simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-50))
      .force(
        'link',
        d3
          .forceLink()
          .strength(1)
          .id(function(d) {
            return d.id;
          })
      )
      .alphaTarget(0)
      .alphaDecay(1);

    this.graphContext = this.graphCanvas.getContext('2d');

    const nodes = [];
    const edges = [];

    const num_nodes = 5;

    for (let i = 0; i < num_nodes; i++) {
      nodes.push(new MachineNode(defaultMachineObjectMock, 0, i * 300, 500));
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

    this.props.setGraphData(data);
  }

  componentWillReceiveProps = newProps => {
    if (this.props.mouseMode === 'link' && newProps.mouseMode !== 'link') {
      if (
        this.props.graphSourceNode !== null ||
        newProps.graphSourceNode !== null
      ) {
        this.props.setGraphSourceNode(null);
        console.error('RESET SOURCE');
      }
    }
  };

  componentDidUpdate = () => {
    if (!this.initialized) {
      this.initialized = true;
      this.graphContext = this.graphCanvas.getContext('2d');
      this.initGraph();
      this.simulation.restart(0.3);
    } else {
      this.graphContext = this.graphCanvas.getContext('2d');
      this.updateGraph();
      this.simulation.restart(0.3);
    }
  };

  updateGraph = () => {
    let { simulation } = this;
    const { graphData } = this.props;

    const newSelectedNodes = {};
    const newSelectedEdges = {};

    const nodeSet = new Set(graphData.nodes.map(item => item.id.toString()));
    const edgeSet = new Set(graphData.edges.map(item => item.id.toString()));

    Object.keys(this.selectedEdges).forEach(id => {
      if (edgeSet.has(id)) {
        newSelectedEdges[id] = this.selectedEdges[id];
      }
    });

    this.selectedEdges = newSelectedEdges;

    Object.keys(this.selectedNodes).forEach(id => {
      if (nodeSet.has(id)) {
        newSelectedNodes[id] = this.selectedNodes[id];
      }
    });

    this.selectedNodes = newSelectedNodes;

    this.regenerateFidelity();

    simulation.nodes(graphData.nodes).on('tick', this.simulationUpdate);

    simulation.force('link').links(graphData.edges);
  };

  zoomed = () => {
    const { graphData, graphFidelity } = this.props;

    if (this.props.mouseMode !== 'move' && this.props.mouseMode !== 'add') {
      return;
    }

    const transform = (this.transform = d3.event.transform); // REQUIRED for updating the zoom

    if (graphFidelity !== 'low' && transform.k !== this.k) {
      this.k = transform.k;
      graphData.nodes.forEach(node => {
        node.preRender(transform);
      });
    }

    this.simulationUpdate();
  };

  simulationUpdate = () => {
    const context = this.graphContext;
    const { width, height, graphData, graphFidelity } = this.props;

    const transform = this.transform;

    context.save();

    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);

    context.save();
    context.lineCap = 'round';

    context.globalAlpha = 1.0;
    context.scale(transform.k, transform.k);

    Object.keys(this.selectedEdges).forEach(edgeId => {
      const edge = this.selectedEdges[edgeId];
      const startNode = edge.sourceNode;
      startNode.drawPathToTarget(context, edge);
    });

    if (
      Object.keys(this.selectedEdges).length > 0 ||
      Object.keys(this.selectedNodes).length > 0
    ) {
      // Only make transparency if there are selected edges or nodes.
      context.globalAlpha = 0.2;
    }

    graphData.edges.forEach(edge => {
      // Skip rendering this edge if we have already rendered;
      if (this.selectedEdges[edge.id]) return;
      const startNode = edge.sourceNode;
      startNode.drawPathToTarget(context, edge);
    });
    context.restore();

    context.globalAlpha = 1.0;

    context.save();

    const selectedNode = this.props.graphSourceNode;

    if (graphFidelity === 'low') {
      context.scale(transform.k, transform.k);

      Object.keys(this.selectedNodes).forEach(nodeId => {
        const node = this.selectedNodes[nodeId];
        node.lowRender(context, selectedNode === node);
      });
    } else {
      Object.keys(this.selectedNodes).forEach(nodeId => {
        const node = this.selectedNodes[nodeId];
        node.render(context, transform, selectedNode === node);
      });
    }

    context.restore();

    if (
      Object.keys(this.selectedEdges).length > 0 ||
      Object.keys(this.selectedNodes).length > 0
    ) {
      // Only make transparency if there are selected edges or nodes.
      context.globalAlpha = 0.2;
    }

    context.save();

    if (graphFidelity === 'low') {
      context.scale(transform.k, transform.k);
      graphData.nodes.forEach(function(d) {
        d.lowRender(context, selectedNode === d);
      });
    } else {
      graphData.nodes.forEach(function(d) {
        d.render(context, transform, selectedNode === d);
      });
    }
    context.restore();

    context.restore();
    context.save();
    // Draw selection rect
    if (this.dragStart && this.dragCurrent) {
      const x1 = this.dragStart.x;
      const y1 = this.dragStart.y;
      const x2 = this.dragCurrent.x;
      const y2 = this.dragCurrent.y;

      context.globalAlpha = 0.15;
      context.fillStyle = '#FFA328';
      context.fillRect(x1, y1, x2 - x1, y2 - y1);

      context.setLineDash([8, 2]);
      context.strokeStyle = '#FFA328';
      context.globalAlpha = 1.0;

      context.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
    context.restore();
  };

  clicked = context => {
    if (d3.event.defaultPrevented) {
      return;
    }

    const { graphData } = this.props;

    const transform = this.transform;

    // Changed from x and y, because apparently they dont match up with the dragSubject???
    const x = transform.invertX(d3.event.offsetX);
    const y = transform.invertY(d3.event.offsetY);

    const selectedNodeKeys = Object.keys(this.selectedNodes);

    if (this.props.mouseMode === 'select') {
      // First, check the node clicking:

      const nodes = this.props.graphData.nodes;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.intersectsPoint(x, y)) {
          this.selectedNodes[node.id] = node;
          this.simulationUpdate();
          return;
        }
      }

      const innerCanvas = document.createElement('canvas');
      const innerContext = innerCanvas.getContext('2d');
      innerContext.canvas.width = 3;
      innerContext.canvas.height = 3;

      innerContext.translate(-x + 1, -y + 1);

      const edges = this.props.graphData.edges;

      for (let i = 0; i < edges.length; i++) {
        // console.time("paintCheck");
        const edge = edges[i];
        edge.paintEdge(innerContext);
        const innerData = innerContext.getImageData(1, 1, 1, 1).data;
        // console.timeEnd("paintCheck");
        if (innerData.every(item => item !== 0)) {
          this.selectedEdges[edge.id] = edge;
          this.simulationUpdate();
          return;
        }
      }

      this.selectedNodes = {};
      this.selectedEdges = {};
      this.simulationUpdate();
      this.props.setMouseMode('move');
      return;
    } else if (this.props.mouseMode === 'move' && selectedNodeKeys.length) {
      for (let i = 0; i < selectedNodeKeys.length; i++) {
        const node = this.selectedNodes[selectedNodeKeys[i]];
        if (node.intersectsPoint(x, y)) {
          return; // noop for now
        }
      }
    } else if (this.props.mouseMode === 'move') {
      // First, check the node clicking:

      const nodes = this.props.graphData.nodes;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.intersectsPoint(x, y)) {
          this.selectedNodes[node.id] = node;
          this.simulationUpdate();
          this.props.setMouseMode('select');
          return;
        }
      }

      const innerCanvas = document.createElement('canvas');
      const innerContext = innerCanvas.getContext('2d');
      innerContext.canvas.width = 3;
      innerContext.canvas.height = 3;

      innerContext.translate(-x + 1, -y + 1);

      const edges = this.props.graphData.edges;

      for (let i = 0; i < edges.length; i++) {
        // console.time("paintCheck");
        const edge = edges[i];
        edge.paintEdge(innerContext);
        const innerData = innerContext.getImageData(1, 1, 1, 1).data;
        // console.timeEnd("paintCheck");
        if (innerData.every(item => item !== 0)) {
          this.selectedEdges[edge.id] = edge;
          this.simulationUpdate();
          this.props.setMouseMode('select');
          return;
        }
      }
    }

    if (this.props.mouseMode === 'add' && this.props.selectedMachine) {
      const newGraph = Object.assign({}, this.props.graphData);

      // d3.event.x, y: d3.event.y

      newGraph.nodes.push(
        new MachineNode(
          this.props.selectedMachine,
          0,
          x,
          y,
          true,
          this.props.translate
        )
      );
      this.props.setGraphData(newGraph);
    } else if (this.props.mouseMode === 'link') {
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

      if (this.props.graphSourceNode) {
        if (selectedNode) {
          if (this.props.graphSourceNode === selectedNode) {
            this.props.setGraphSourceNode(null);
          } else {
            const graphData = this.props.graphData;

            try {
              console.error('AAAAA', this.props.graphSourceNode, selectedNode);
              const edge = new GraphEdge(
                this.props.graphSourceNode,
                selectedNode
              );
              graphData.edges.push(edge);
              this.props.setGraphData(graphData);
              this.props.setGraphSourceNode(null);
            } catch (e) {
              console.error('Output slot full!', e);
            }
          }
        } else {
          this.props.setGraphSourceNode(null);
        }
      } else {
        if (selectedNode) {
          this.props.setGraphSourceNode(selectedNode);
        }
      }
    }
  };

  dragStartFunc = () => {
    let { simulation } = this;

    const transform = this.transform;

    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    const x = transform.invertX(d3.event.x);
    const y = transform.invertY(d3.event.y);
    d3.event.subject.fx = x;
    d3.event.subject.fy = y;

    // Set the drag start
    if (this.props.mouseMode === 'select') {
      this.dragStart = { x: d3.event.x, y: d3.event.y, ex: x, ey: y };
    }

    // if (this.props.mouseMode === 'move' && ) {
    //   this.dragStart = {x: d3.event.x, y: d3.event.y, ex: x, ey: y };
    // }
    //
    // const deltaX = d3.event.subject.x - d3.event.subject.fx;
    // const deltaY = d3.event.subject.y - d3.event.subject.fy;
    //
    // for (let i = graphData.nodes.length - 1; i >= 0; --i) {
    //   const node = graphData.nodes[i];
    //   node.fx = node.x - deltaX;
    //   node.fy = node.y - deltaY;
    // }
  };

  draggedFunc = () => {
    const transform = this.transform;
    const x = transform.invertX(d3.event.x);
    const y = transform.invertY(d3.event.y);

    if (this.props.mouseMode === 'select') {
      this.dragCurrent = { x: d3.event.x, y: d3.event.y, ex: x, ey: y };
    }

    const subject = d3.event.subject;

    if (subject instanceof GraphNode) {
      subject.fx = x;
      subject.fy = y;
      subject.sortSlots();
      subject.sortConnectedNodeSlots();
    } else if (
      this.props.mouseMode !== 'select' &&
      Object.keys(this.selectedNodes).length
    ) {
      // It's a grouping of nodes
      Object.keys(this.selectedNodes).forEach(key => {
        const node = this.selectedNodes[key];
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

  dragEndFunc = () => {
    let { simulation } = this;
    let { graphData } = this.props;

    if (!d3.event.active) simulation.alphaTarget(0);

    if (this.props.mouseMode === 'select') {
      // TODO: Selection logic
      console.log('DRAGENDED!!!!!');
      this.selectedNodes = {};
      this.selectedEdges = {};
      const x1 = this.dragStart.ex;
      const y1 = this.dragStart.ey;
      const x2 = (this.dragCurrent || this.dragStart).ex;
      const y2 = (this.dragCurrent || this.dragStart).ey;

      graphData.nodes.forEach(node => {
        if (node.intersectsRect(x1, y1, x2, y2)) {
          this.selectedNodes[node.id] = node;
        }
      });

      graphData.edges.forEach(edge => {
        if (edge.intersectsRect(x1, y1, x2, y2)) {
          this.selectedEdges[edge.id] = edge;
        }
      });

      this.dragStart = null;
      this.dragCurrent = null;
      return;
    }

    this.dragStart = null;
    this.dragCurrent = null;

    for (let i = graphData.nodes.length - 1; i >= 0; --i) {
      const node = graphData.nodes[i];
      // node.fx = node.x - deltaX;
      // node.fy = node.y - deltaY;
      console.error('ENDED');
      node.x = node.fx;
      node.y = node.fy;
      // node.fx = null;
      // node.fy = null;
    }
    //
    // d3.event.subject.fx = null;
    // d3.event.subject.fy = null;
  };

  dragSubject = () => {
    const { graphData } = this.props;

    const transform = this.transform;

    if (this.props.mouseMode === 'link') {
      return null;
    }

    let i,
      x = transform.invertX(d3.event.x),
      y = transform.invertY(d3.event.y);

    // console.error("DRAGSUB", x, y);

    if (this.props.mouseMode === 'select') {
      return { x: d3.event.x, y: d3.event.y };
    }

    const selectedNodeKeys = Object.keys(this.selectedNodes);

    let draggingGroup = false;

    if (this.props.mouseMode === 'move' && selectedNodeKeys.length) {
      for (i = 0; i < selectedNodeKeys.length; i++) {
        const node = this.selectedNodes[selectedNodeKeys[i]];
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
      node.fx = node.x;
      node.fy = node.y;
    }

    for (i = graphData.nodes.length - 1; i >= 0; --i) {
      const node = graphData.nodes[i];
      if (node.intersectsPoint(x, y)) {
        node.x = transform.applyX(node.x);
        node.y = transform.applyY(node.y);
        this.selectedNodes = {};
        this.selectedEdges = {};
        return node;
      }
    }

    if (this.props.mouseMode === 'add') {
      return { x: d3.event.x, y: d3.event.y };
    }

    return null;
  };

  regenerateFidelity = () => {
    const { graphData, graphFidelity } = this.props;

    if (graphFidelity === 'low') {
      graphData.nodes.forEach(node => {
        node.preRender(d3.zoomIdentity);
      });
    } else {
      graphData.nodes.forEach(node => {
        node.preRender(this.transform);
      });
    }
  };

  initGraph = () => {
    let { graphCanvas } = this;

    const thisAccessor = this;

    d3.select(graphCanvas)
      .call(
        d3
          .drag()
          .clickDistance(4)
          .subject(this.dragSubject)
          .on('start', this.dragStartFunc)
          .on('drag', this.draggedFunc)
          .on('end', this.dragEndFunc)
      )
      .on('click', function() {
        thisAccessor.clicked(this);
      })
      .call(
        d3
          .zoom()
          .filter(function() {
            if (thisAccessor.props.mouseMode === 'add') {
              return d3.event.type !== 'dblclick';
            }

            if (thisAccessor.props.mouseMode === 'link') {
              return false;
            }
            return true;
          })
          .scaleExtent([1 / 10, 8])
          .on('zoom', this.zoomed)
      );
    this.updateGraph();
  };

  render() {
    return (
      <canvas
        className={this.props.classes.canvas}
        style={{ display: 'block' }}
        id={this.canvasId}
        ref={this.props.reference}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    graphData: state.graphReducer.graphData,
    graphTransform: state.graphReducer.graphTransform,
    graphFidelity: state.graphReducer.graphFidelity,
    mouseMode: state.graphReducer.mouseMode,
    selectedMachine: state.graphReducer.selectedMachine,
    graphSourceNode: state.graphReducer.graphSourceNode,
    translate: getTranslate(state.localize)
    // dragCurrent: state.graphReducer.dragCurrent,
    // dragStart: state.graphReducer.dragStart
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
    setGraphSourceNode: data => dispatch(setGraphSourceNode(data)),
    setMouseMode: data => dispatch(setMouseMode(data))

    // setDragStart: data => dispatch(setDragStart(data)),
    // setDragCurrent: data => dispatch(setDragCurrent(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SGCanvas));
