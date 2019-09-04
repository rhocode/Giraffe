import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// import {canvasBackgroundColor} from "../../../theme";
import SGCanvas from "../libraries/SGLib/react/SGCanvas";
import GraphActionsBottomActions from "./GraphActionsBottomActions";

const styles = theme => ({
  canvasContainer: {
    display: "grid",
    gridArea: "canvasArea",
    gridTemplateAreas: `"canvasElement"`,
    gridTemplateRows: "minmax(0, 1fr)",
    gridTemplateColumns: "1fr",
    minWidth: 0,
    minHeight: 0,
    position: "relative"
    // overflow: "hidden"
  }
});

class GraphCanvas extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div ref={this.canvasContainer} className={classes.canvasContainer}>
        {this.state.width && this.state.height ? (
          <SGCanvas
            reference={this.canvas}
            width={this.state.width}
            height={this.state.height}
          />
        ) : null}
        <GraphActionsBottomActions />
      </div>
    );
  }
}

export default withStyles(styles)(GraphCanvas);
