import {withStyles} from '@material-ui/core';
import React from 'react';
import {connect} from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import SettingsIcon from '@material-ui/icons/Settings';

import GraphAppBarButton from './GraphAppBarButton';
import {setGraphFidelity} from '../../../redux/actions/Graph/graphActions';

const styles = theme => ({});

function GraphSettingsButton(props) {
  const {graphFidelity} = props;

  function handleChange(event, newValue) {
    props.setGraphFidelity(newValue ? 'high' : 'low');
  }

  return (
    <GraphAppBarButton label="Settings" icon={<SettingsIcon/>}>
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
    </GraphAppBarButton>
  );
}

function mapStateToProps(state) {
  return {
    graphFidelity: state.graphReducer.graphFidelity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphFidelity: data => dispatch(setGraphFidelity(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphSettingsButton));
