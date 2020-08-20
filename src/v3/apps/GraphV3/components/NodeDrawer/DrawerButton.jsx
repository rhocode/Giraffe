import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { baseTheme } from 'theme';
import DrawerDialog from './DrawerDialog';
import {
  getBuildableMachineClassIcon,
  getBuildingIcon
} from 'v3/data/loaders/buildings';

const styles = theme => ({
  default: {
    zIndex: theme.zIndex.drawer
  },
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  image: {
    height: 50
  },
  buttonSquare: {
    minWidth: baseTheme.overrides.GraphAddMachineButton.width,
    minHeight: baseTheme.overrides.GraphAddMachineButton.height,
    maxWidth: baseTheme.overrides.GraphAddMachineButton.width,
    maxHeight: baseTheme.overrides.GraphAddMachineButton.height,
    margin: baseTheme.overrides.GraphAddMachineButton.margin,
    textTransform: 'none'
  },
  buttonContents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  buttonContainer: {
    width:
      baseTheme.overrides.GraphAddMachineButton.width +
      baseTheme.overrides.GraphAddMachineButton.margin * 2,
    height:
      baseTheme.overrides.GraphAddMachineButton.height +
      baseTheme.overrides.GraphAddMachineButton.margin * 2,
    display: 'inline-block'
  }
});

function DrawerButton(props) {
  const { classes, nodeClass, closeDrawerFunction } = props;
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <React.Fragment>
      <div className={classes.buttonContainer}>
        <Button
          size="large"
          color={props.selected ? 'primary' : undefined}
          variant={props.selected ? 'contained' : undefined}
          className={classes.buttonSquare}
          onClick={() => setOpenDialog(true)}
        >
          <div className={classes.buttonContents}>
            {/*<ArrowDropUpIcon/>*/}
            <img
              src={getBuildingIcon(getBuildableMachineClassIcon(nodeClass), 256)}
              className={classes.image}
              alt={props.label}
            />
            <Typography>{props.label}</Typography>
          </div>
        </Button>
        {// workaround to get the open dialog to prevent scrolling
        openDialog ? (
          <DrawerDialog
            label={props.label}
            nodeClass={nodeClass}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            closeDrawerFunction={closeDrawerFunction}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(DrawerButton);
