import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InternalCanvas from "./InternalCanvas";
import {stringGen} from "../../apps/Graph/libraries/SGLib/utils/stringUtils";

const styles = theme => ({
  canvasContainer: {
    flex: 1
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  headingSpacer: {
    minHeight: theme.overrides.GraphAppBar.height,
    width: '100%'
  }
});

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.canvasContainer = React.createRef();

    this.state = {
      width: 0,
      height: 0,
    };

    this.timer = null;
    this.offset = 0;

    this.canvasId = stringGen(10);
  }

  componentWillMount() {
    window.addEventListener('resize', this.measureCanvas, false);
    this.timer = this.drawRowOfRhombus();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureCanvas, false);
    window.cancelAnimationFrame(this.time);
  }

  drawRowOfRhombus = () => {
    const fps = 100;
    setTimeout(() => {
      requestAnimationFrame(this.drawRowOfRhombus);

      const ctx = this.canvas.current.getContext('2d');
      const width = this.state.width;
      const offset = this.offset;

      const rhombusDimension = 50;
      const numberOfRhombus = (width / rhombusDimension) + 2;

      this.offset = (offset + 1) % rhombusDimension;

      const starting = this.offset - rhombusDimension;

      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

      for (let i = 0; i < numberOfRhombus; i++) {
        this.drawRhombus(ctx, starting + (i * rhombusDimension),  0, rhombusDimension, rhombusDimension);
      }

    }, 5 / fps);
  };

  drawRhombus(context, xTop, yTop, rhombusHeight, rhombusWidth) {
    context.fillStyle = 'yellow';
    context.beginPath();
    context.moveTo(xTop + rhombusWidth/2, yTop);
    context.lineTo(xTop + rhombusWidth, yTop);
    context.lineTo(xTop + rhombusWidth/2, yTop + rhombusHeight);
    context.lineTo(xTop, yTop + rhombusHeight);
    context.closePath();
    context.fill();
  }

  measureCanvas = () => {
    let rect = this.canvasContainer.current.getBoundingClientRect();
    if (this.state.width !== rect.width || this.state.height !== rect.height) {
      this.setState({
        width: rect.width,
        height: rect.height
      });
    }
  };

  componentDidMount() {
    this.measureCanvas();
  }

  componentDidUpdate() {
    this.measureCanvas();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.headingSpacer} />
        <div ref={this.canvasContainer} className={classes.canvasContainer}>
          <canvas
            style={{ display: 'block' }}
            id={this.canvasId}
            ref={this.canvas}
            width={this.state.width}
            height={this.state.height}
          />
        </div>
      </div>
    );
  }
}

export default (withStyles(styles)(Canvas));
