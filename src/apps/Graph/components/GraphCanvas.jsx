import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
// import {canvasBackgroundColor} from "../../../theme";
import SGCanvas from '../libraries/SGLib/react/SGCanvas';

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

class GraphCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.canvasContainer = React.createRef();

    this.state = {
      width: 0,
      height: 0
    };
    console.log(this.props);
  }

  componentWillMount() {
    window.addEventListener('resize', this.measureCanvas, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureCanvas, false);
  }

  measureCanvas = () => {
    let rect = this.canvasContainer.current.getBoundingClientRect();
    console.log(rect);
    if (this.state.width !== rect.width || this.state.height !== rect.height) {
      console.log('SHOULD UPDATE');
      this.setState({
        width: rect.width,
        height: rect.height
      });
    }
  };

  drawCanvas = () => {
    // const canvas = this.canvas.current;
    // const ctx = canvas.getContext("2d");
    //
    // function getRandomColor() {
    //   var letters = '0123456789ABCDEF';
    //   var color = '#';
    //   for (var i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // }
    //
    // ctx.fillStyle = getRandomColor();
    //   // canvasBackgroundColor;
    // ctx.fillRect(10, 10, 20, 20);
  };

  componentDidMount() {
    this.measureCanvas();
    // this.drawCanvas();
  }

  componentDidUpdate() {
    // this.drawCanvas();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.headingSpacer} />
        <div ref={this.canvasContainer} className={classes.canvasContainer}>
          {this.state.width && this.state.height ? (
            <SGCanvas
              reference={this.canvas}
              width={this.state.width}
              height={this.state.height}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphCanvas));
