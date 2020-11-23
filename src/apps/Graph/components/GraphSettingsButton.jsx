import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import transformGraph from '../libraries/SGLib/algorithms/satisgraphtory/transform';

import GraphAppBarButton from './GraphAppBarButton';

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
        Analyzez
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

export default GraphSettingsButton;
