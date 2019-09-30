import { withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import SettingsIcon from '@material-ui/icons/Settings';

import GraphAppBarButton from './GraphAppBarButton';
import {
  forceRefreshGraph,
  setGraphFidelity
} from '../../../redux/actions/Graph/graphActions';
import Button from '@material-ui/core/Button';
import transformGraph from '../libraries/SGLib/algorithms/satisgraphtory/transform';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  }
});

function GraphSettingsButton(props) {
  const { graphFidelity, classes, graphData, forceRefreshGraph } = props;

  function handleChange(event, newValue) {
    props.setGraphFidelity(newValue ? 'high' : 'low');
  }

  return (
    <GraphAppBarButton label="Settings" icon={<SettingsIcon />}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={graphFidelity === 'high'}
              onChange={handleChange}
              value={graphFidelity}
              color="primary"
            />
          }
          label="High Fidelity Graph"
        />
      </FormGroup>
      <Button variant="contained" color="primary" className={classes.button}>
        Analyze
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={() => {
          if (graphData) {
            transformGraph(graphData, () => {
              forceRefreshGraph();
            });
          }
        }}
      >
        Optimize
      </Button>
    </GraphAppBarButton>
  );
}

function mapStateToProps(state) {
  return {
    graphFidelity: state.graphReducer.graphFidelity,
    graphData: state.graphReducer.graphData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphFidelity: data => dispatch(setGraphFidelity(data)),
    forceRefreshGraph: () => dispatch(forceRefreshGraph())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphSettingsButton));
