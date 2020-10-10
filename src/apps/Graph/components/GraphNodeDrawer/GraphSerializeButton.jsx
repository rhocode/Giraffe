import React from "react";
import { getTranslate } from "react-localize-redux";
import {
  setGraphData,
  setGraphSourceNode,
  setMouseMode,
} from "../../../../redux/actions/Graph/graphActions";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import getLatestSchema from "../../libraries/SGLib/utils/getLatestSchema";
import serialize from "../../libraries/SGLib/algorithms/satisgraphtory/serialize";

function GraphSerializeButton(props) {
  const data = props.graphData;

  const schema = getLatestSchema();
  const serialized = serialize(schema, data);

  return <pre>{JSON.stringify(serialized, null, 4)}</pre>;
}

const styles = () => ({});

function mapStateToProps(state) {
  return {
    graphData: state.graphReducer.graphData,
    graphFidelity: state.graphReducer.graphFidelity,
    mouseMode: state.graphReducer.mouseMode,
    selectedMachine: state.graphReducer.selectedMachine,
    graphSourceNode: state.graphReducer.graphSourceNode,
    translate: getTranslate(state.localize),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: (data) => dispatch(setGraphData(data)),
    setGraphSourceNode: (data) => dispatch(setGraphSourceNode(data)),
    setMouseMode: (data) => dispatch(setMouseMode(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphSerializeButton));
