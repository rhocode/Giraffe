import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as d3 from 'd3';
import {stringGen} from '../utils/stringUtils';
import MachineNode, {GraphNode} from '../datatypes/graphNode';
import {setGraphData} from '../../../../../redux/actions/Graph/graphActions';
import {GraphEdge} from "../datatypes/graphEdge";
import {withStyles} from "@material-ui/core";

const styles = () => ({
  // canvasContainer: {
  //   display: "grid",
  //   gridTemplateAreas:
  //     `"spacerTop"
  //      "loader"
  //      "spacerBottom"`,
  //   gridTemplateRows: "1fr auto 1fr",
  //   gridTemplateColumns: "1fr",
  // },
  canvas: {
    gridArea: 'canvasElement',
    minWidth: 0,
    minHeight: 0
  },
});
class SGCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasId = stringGen(10);
    this.initializeSGLib();
    this.transform = d3.zoomIdentity;
    this.state = {
      loaded: false,
    };
    this.k = 1;
  }

  initializeSGLib() {}

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
      nodes.push(new MachineNode(0, 0, 0, i * 300, 500))
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
    this.initGraph(data);
  }

  componentDidUpdate = () => {
    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .strength(1)
          .id(function(d) {
            return d.id;
          })
      )
      .alphaDecay(1);

    this.graphContext = this.graphCanvas.getContext('2d');

    this.initGraph(this.props.graphData);
    this.simulation.restart(0.3);
  };

  initGraph = tempData => {

    let { graphCanvas, simulation } = this;
    const context = this.graphContext;
    const { width, height, graphData, graphFidelity } = this.props;

    const thisAccessor = this;

    tempData.nodes.forEach(node => {
      node.preRender(this.transform);
    });

    const zoomed = () =>  {
      const transform = this.transform = d3.event.transform; // REQUIRED for updating the zoom

      if (graphFidelity !== 'low' && transform.k !== thisAccessor.k) {
        thisAccessor.k = transform.k;
        graphData.nodes.forEach(node => {
          node.preRender(transform);
        });
      }

      simulationUpdate();
    };

    const clicked = (context) => {
      if (d3.event.defaultPrevented) {
        return;
      }

      const point = d3.mouse(context),
        p = { x: point[0], y: point[1] };

      console.error(p);
    };

    const dragSubject =() => {
      const transform = this.transform;

      let i,
        x = transform.invertX(d3.event.x),
        y = transform.invertY(d3.event.y);

      if (this.props.mouseMode === 'select') {
        return {x: d3.event.x, y: d3.event.y};
      }

      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        const node = tempData.nodes[i];
        node.fx = node.x;
        node.fy = node.y;
      }

      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        const node = tempData.nodes[i];
        // dx = x - node.x;
        // dy = y - node.y;
        // context.save();
        // context.fillStyle = "red";
        // context.rect(300, 300, 600, 600);
        // context.fill();
        // context.restore();
        if (node.isInBoundingBox(x, y)) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
          return node;
        }
        // console.error(x, y)
        //
        // if (dx * dx + dy * dy < radius * radius) {
        //   node.x = transform.applyX(node.x);
        //   node.y = transform.applyY(node.y);
        //
        //   return node;
        // }
      }

    };

    const dragStart = ()  =>{

      const transform = thisAccessor.transform;

      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      const x = transform.invertX(d3.event.x);
      const y = transform.invertY(d3.event.y);
      d3.event.subject.fx = x;
      d3.event.subject.fy = y;


      // Set the drag start
      if (this.props.mouseMode === 'select') {
        this.dragStart = {x: d3.event.x, y: d3.event.y, ex: x, ey: y };
      }

      // const deltaX = d3.event.subject.x - d3.event.subject.fx;
      // const deltaY = d3.event.subject.y - d3.event.subject.fy;
      //
      // for (let i = tempData.nodes.length - 1; i >= 0; --i) {
      //   const node = tempData.nodes[i];
      //   node.fx = node.x - deltaX;
      //   node.fy = node.y - deltaY;
      // }
    };

    const dragged = () => {
      const transform = thisAccessor.transform;
      const x = transform.invertX(d3.event.x);
      const y = transform.invertY(d3.event.y);

      d3.event.subject.fx = x;
      d3.event.subject.fy = y;

      if (this.props.mouseMode === 'select') {
        this.dragCurrent = {x: d3.event.x, y: d3.event.y, ex: x, ey: y};
      }

      const subject = d3.event.subject;

      if (subject instanceof GraphNode) {
        subject.sortSlots();
        subject.sortConnectedNodeSlots();
      }


      // const deltaX = d3.event.subject.x - d3.event.subject.fx;
      // const deltaY = d3.event.subject.y - d3.event.subject.fy;
      //
      // for (let i = tempData.nodes.length - 1; i >= 0; --i) {
      //   const node = tempData.nodes[i];
      //   node.fx = node.x - deltaX;
      //   node.fy = node.y - deltaY;
      // }
    };

    const dragEnd = () => {
      if (!d3.event.active) simulation.alphaTarget(0);

      if (this.props.mouseMode === 'select') {
        // TODO: Selection logic
        this.dragStart = null;
        this.dragCurrent = null;
        return;
      }

      for (let i = tempData.nodes.length - 1; i >= 0; --i) {
        const node = tempData.nodes[i];
        // node.fx = node.x - deltaX;
        // node.fy = node.y - deltaY;
        node.x = node.fx;
        node.y = node.fy;
        // node.fx = null;
        // node.fy = null;
      }
      //
      // d3.event.subject.fx = null;
      // d3.event.subject.fy = null;
    };

    d3.select(graphCanvas)
      .call(
        d3
          .drag()
          .subject(dragSubject)
          .on('start', dragStart)
          .on('drag', dragged)
          .on('end', dragEnd)
      )
      .on('click', function() {
        clicked(this);
      })
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', zoomed)
      );

    const simulationUpdate = () => {
      const transform = thisAccessor.transform;

      context.save();

      context.clearRect(0, 0, width, height);
      // context.translate(transform.x, transform.y);
      // context.scale(transform.k, transform.k);


      context.translate(transform.x, transform.y);

      context.save();
      context.scale(transform.k, transform.k);
      context.globalAlpha = 0.2;

      context.lineCap = "round";
      tempData.nodes.forEach(node => {
        node.outputSlots.forEach((edge) => {
          if (!edge) return;
          node.drawPathToTarget(context, edge);
        });
      });
      context.restore();
      context.globalAlpha = 0.1;
      if (graphFidelity === 'low') {
        context.scale(transform.k, transform.k);
        tempData.nodes.forEach(function(d) {
          d.lowRender(context);
        });
      } else {
        tempData.nodes.forEach(function(d) {
          d.render(context, transform);
        });
      }

      context.restore();
      context.save();

      // Draw selection rect
      if (this.dragStart && this.dragCurrent) {
        context.save();
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


        // context.translate(transform.x, transform.y);
        // context.scale(transform.k, transform.k);
        //
        // const x12 = this.dragStart.ex;
        // const y12 = this.dragStart.ey;
        // const x22 = this.dragCurrent.ex;
        // const y22 = this.dragCurrent.ey;
        // context.rect(x12, y12, x22 - x12, y22 - y12);
        // context.strokeStyle = '#D4CE22';
        // context.stroke();
        context.restore();
      }
      context.restore();
    };

    simulation.nodes(tempData.nodes).on('tick', simulationUpdate);

    simulation.force('link').links(tempData.edges);
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
    // dragCurrent: state.graphReducer.dragCurrent,
    // dragStart: state.graphReducer.dragStart
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
    // setDragStart: data => dispatch(setDragStart(data)),
    // setDragCurrent: data => dispatch(setDragCurrent(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SGCanvas));