import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InternalCanvas from './InternalCanvas';

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
      height: 0
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.measureCanvas, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureCanvas, false);
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

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.headingSpacer} />
        <div ref={this.canvasContainer} className={classes.canvasContainer}>
          {this.state.width && this.state.height ? (
            <InternalCanvas
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

export default withStyles(styles)(Canvas);
