import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { stringGen } from '../utils/stringUtils';
import MachineNode from '../datatypes/graphNode';
import {setGraphData} from '../../../../../redux/actions/Graph/graphActions';

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

    const num_nodes = 200;

    for (let i = 0; i < num_nodes; i++) {
      nodes.push(new MachineNode(0, 0, 0, i * 200, i * 180))
    }

    for (let i = 0; i < num_nodes - 1; i++) {
      edges.push({source: nodes[i].id, target: nodes[i+1].id})
    }

    const data = {
      nodes: nodes,
      edges: edges
        // [{ source: mn1.id, target: mn2.id }]
    };

    const nodeMapping = {};
    data.nodes.forEach(node => {
      nodeMapping[node.id] = node;
    });

    // resolveEdges
    data.edges.forEach(edge => {
      const source = nodeMapping[edge.source];
      const target = nodeMapping[edge.target];
      source.addTarget(target);
      target.addSource(source);
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

    let { transform, graphCanvas, simulation } = this;
    const context = this.graphContext;
    const { width, height, graphData, graphFidelity } = this.props;

    const thisAccessor = this;

    tempData.nodes.forEach(node => {
      node.preRender(transform);
    });

    function zoomed() {
      transform = d3.event.transform; // REQUIRED for updating the zoom


      if (graphFidelity !== 'low' && transform.k !== thisAccessor.k) {
        thisAccessor.k = transform.k;
        graphData.nodes.forEach(node => {
          node.preRender(transform);
        });
      }

      // if (transform.k !== thisAccessor.k) {
      //   thisAccessor.k = transform.k;
      //
      // }
      simulationUpdate();
    }

    function clicked() {
      if (d3.event.defaultPrevented) {
        return;
      }
      var point = d3.mouse(this),
        p = { x: point[0], y: point[1] };

      console.log('CLICKED', p);
    }

    d3.select(graphCanvas)
      .call(
        d3
          .drag()
          .subject(dragsubject)
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .on('click', clicked)
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', zoomed)
      );

    function dragsubject() {
      var i,
        x = transform.invertX(d3.event.x),
        y = transform.invertY(d3.event.y);

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
    }

    function dragstarted() {
      // console.log('DRAGSTARTED');

      if (!d3.event.active) simulation.alphaTarget(0.3).restart();

      d3.event.subject.fx = transform.invertX(d3.event.x);
      d3.event.subject.fy = transform.invertY(d3.event.y);

      // const deltaX = d3.event.subject.x - d3.event.subject.fx;
      // const deltaY = d3.event.subject.y - d3.event.subject.fy;
      //
      // for (let i = tempData.nodes.length - 1; i >= 0; --i) {
      //   const node = tempData.nodes[i];
      //   node.fx = node.x - deltaX;
      //   node.fy = node.y - deltaY;
      // }
    }

    function dragged() {
      d3.event.subject.fx = transform.invertX(d3.event.x);
      d3.event.subject.fy = transform.invertY(d3.event.y);


      // const deltaX = d3.event.subject.x - d3.event.subject.fx;
      // const deltaY = d3.event.subject.y - d3.event.subject.fy;
      //
      // for (let i = tempData.nodes.length - 1; i >= 0; --i) {
      //   const node = tempData.nodes[i];
      //   node.fx = node.x - deltaX;
      //   node.fy = node.y - deltaY;
      // }
    }

    function dragended() {

      // console.log('DRAGSTARTED3');
      if (!d3.event.active) simulation.alphaTarget(0);

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
    }

    simulation.nodes(tempData.nodes).on('tick', simulationUpdate);

    simulation.force('link').links(tempData.edges);

    function simulationUpdate() {
      context.save();

      context.clearRect(0, 0, width, height);
      // context.translate(transform.x, transform.y);
      // context.scale(transform.k, transform.k);

      // tempData.edges.forEach(function(d) {
      //   d.source.drawPathToTarget(context, d.target);
      // });


      context.translate(transform.x, transform.y);

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
    }
  };

  render() {
    return (
      <canvas
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
    graphFidelity: state.graphReducer.graphFidelity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SGCanvas);