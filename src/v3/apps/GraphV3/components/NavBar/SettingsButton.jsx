import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import IconDialog from './IconDialog';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function SettingsButton(props) {
  const classes = useStyles();

  const { id: pixiCanvasStateId } = props;

  const snapToGrid = pixiJsStore.useState((state) => {
    return state[pixiCanvasStateId]?.snapToGrid || false;
  });

  const handleSnapToGridChange = React.useCallback(
    (event, value) => {
      pixiJsStore.update((s) => {
        if (value !== s[pixiCanvasStateId].snapToGrid) {
          s[pixiCanvasStateId].snapToGrid = value;
        }
      });
    },
    [pixiCanvasStateId]
  );

  return (
    <IconDialog label="Settings" icon={<SettingsIcon />}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={snapToGrid}
              onChange={handleSnapToGridChange}
              color="primary"
            />
          }
          label="Snap To Grid"
        />
      </FormGroup>
      <Button variant="contained" color="primary" className={classes.button}>
        Analyze
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={() => {}}
      >
        Optimize
      </Button>
    </IconDialog>
  );
}

export default SettingsButton;
