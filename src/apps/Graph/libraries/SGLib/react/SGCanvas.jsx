import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { stringGen } from '../utils/stringUtils';
import MachineNode from '../datatypes/graphNode';
import { setGraphData } from '../../../../../redux/actions/Graph/graphActions';

class SGCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasId = stringGen(10);
    this.initializeSGLib();
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
      .alphaDecay(0.05);

    this.transform = d3.zoomIdentity;

    this.graphContext = this.graphCanvas.getContext('2d');

    const mn1 = new MachineNode(0, 0, 0, 0, 0);
    const mn2 = new MachineNode(0, 0, 0, 0, 0);

    const data = {
      nodes: [{ id: 1, data: mn1, fx: 300, fy: 300 }, { id: 2, data: mn2, fx: 600, fy: 600 }],
      edges: [{ source: 1, target: 2 }]
    };

    this.props.setGraphData(data);
    this.initGraph(data);
  }

  componentDidUpdate() {
    const width = this.props.width;
    const height = this.props.height;

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
      .force(
        'collision',
        d3.forceCollide().radius(function(d) {
          return 100;
        })
      )
      .alphaTarget(0)
      .alphaDecay(0.05);

    this.graphContext = this.graphCanvas.getContext('2d');

    const mn1 = new MachineNode(0, 0, 0, 0, 0);
    const mn2 = new MachineNode(0, 0, 0, 0, 0);

    const data = {
      nodes: [{ id: 1, data: mn1, fx: 300, fy: 300 }, { id: 2, data: mn2, fx: 600, fy: 600 }],
      edges: [{ source: 1, target: 2 }]
    };

    this.initGraph(data);
    this.simulation.restart(0.3);
  }

  initGraph = tempData => {
    const radius = 50;

    let { transform, graphCanvas, simulation } = this;
    const context = this.graphContext;
    const { width, height } = this.props;

    function zoomed() {
      transform = d3.event.transform;
      simulationUpdate();
    }

    function clicked() {
      console.log('CLICKED');
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
        y = transform.invertY(d3.event.y),
        dx,
        dy;

      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        const node = tempData.nodes[i];
        node.fx = node.x;
        node.fy = node.y;
      }

      for (i = tempData.nodes.length - 1; i >= 0; --i) {
        const node = tempData.nodes[i];
        dx = x - node.x;
        dy = y - node.y;

        if (dx * dx + dy * dy < radius * radius) {
          node.x = transform.applyX(node.x);
          node.y = transform.applyY(node.y);

          return node;
        }
      }
    }

    function dragstarted() {
      console.log('DRAGSTARTED');
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
      console.log('DRAGSTARTED2');
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
      console.log('DRAGSTARTED3');
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
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      tempData.edges.forEach(function(d) {
        context.beginPath();


        const x1 = d.source.x + 90;
        const y1 = d.source.y;
        const x2 = d.target.x - 90;
        const y2 = d.target.y;
        const avg = (x1 + x2) / 2;

        context.strokeStyle = '#7122D5';
        context.lineWidth  = 8;

        context.moveTo(x1, y1);

        context.bezierCurveTo(avg, y1, avg, y2, x2, y2);
        context.stroke();
      });

      // Draw the nodesv
      tempData.nodes.forEach(function(d, i) {
        d.data.render(context, d);
      });

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
  console.log(state);
  return {
    graphData: state.graphReducer.graphData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SGCanvas);
