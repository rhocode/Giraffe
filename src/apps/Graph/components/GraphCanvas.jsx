import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
// import {canvasBackgroundColor} from "../../../theme";
import SGCanvas from '../libraries/SGLib/react/SGCanvas';
import GraphActionsBottomActions from "./GraphActionsBottomActions";

const styles = theme => ({
  canvasContainer: {
    display: "grid",
    gridArea: "canvasArea",
    gridTemplateAreas:
      `"canvasElement"`,
    gridTemplateRows: "minmax(0, 1fr)",
    gridTemplateColumns: "1fr",
    minWidth: 0,
    minHeight: 0,
    position: "relative"
    // overflow: "hidden"
  },
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
        width: rect.width - 1,
        height: rect.height - 1
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
    const {classes} = this.props;

    return (
      <div ref={this.canvasContainer} className={classes.canvasContainer}>
        {this.state.width && this.state.height ? (
          <SGCanvas
            reference={this.canvas}
            width={this.state.width}
            height={this.state.height}
          />
        ) : null}
        <GraphActionsBottomActions/>
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
