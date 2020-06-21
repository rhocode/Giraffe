import SettingsIcon from '@material-ui/icons/Settings';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
// import transformGraph from "../../../../../apps/Graph/libraries/SGLib/algorithms/satisgraphtory/transform";
import React from 'react';
import { withStyles } from '@material-ui/core';
import IconDialog from './IconDialog';
import { useStoreState } from 'pullstate';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  }
});

function SettingsButton(props) {
  const { classes } = props;

  const graphFidelity = useStoreState(graphAppStore, s => s.graphFidelity);
  const graphData = useStoreState(graphAppStore, s => s.graphData);

  function handleChange(event, newValue) {
    graphAppStore.update(s => {
      const valueToStore = newValue ? 'high' : 'low';
      if (valueToStore !== s.graphFidelity) {
        s.graphFidelity = valueToStore;
      }
    });
  }

  return (
    <IconDialog label="Settings" icon={<SettingsIcon />}>
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
            // transformGraph(graphData, () => {
            //   forceRefreshGraph();
            // });
          }
        }}
      >
        Optimize
      </Button>
    </IconDialog>
  );
}

export default withStyles(styles)(SettingsButton);
