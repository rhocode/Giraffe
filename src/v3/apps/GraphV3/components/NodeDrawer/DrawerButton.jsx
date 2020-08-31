import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { baseTheme } from 'theme';
import {
  getBuildableMachineClassIcon,
  getBuildingIcon,
} from 'v3/data/loaders/buildings';
import DrawerDialog from './DrawerDialog';

const useStyles = makeStyles((theme) => ({
  default: {
    zIndex: theme.zIndex.drawer,
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
    pointerEvents: 'none',
  },
  image: {
    height: 50,
  },
  buttonSquare: {
    minWidth: baseTheme.overrides.GraphAddMachineButton.width,
    minHeight: baseTheme.overrides.GraphAddMachineButton.height,
    maxWidth: baseTheme.overrides.GraphAddMachineButton.width,
    maxHeight: baseTheme.overrides.GraphAddMachineButton.height,
    margin: baseTheme.overrides.GraphAddMachineButton.margin,
    textTransform: 'none',
  },
  buttonContents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonContainer: {
    width:
      baseTheme.overrides.GraphAddMachineButton.width +
      baseTheme.overrides.GraphAddMachineButton.margin * 2,
    height:
      baseTheme.overrides.GraphAddMachineButton.height +
      baseTheme.overrides.GraphAddMachineButton.margin * 2,
    display: 'inline-block',
  },
}));

function DrawerButton(props) {
  const classes = useStyles();
  const { nodeClass, closeDrawerFunction } = props;
  const [openDialog, setOpenDialog] = React.useState(false);

  let image;

  if (props.type === 'building') {
    image = getBuildingIcon(getBuildableMachineClassIcon(nodeClass), 256);
  } else {
  }

  return (
    <React.Fragment>
      <div className={classes.buttonContainer}>
        <Button
          size="large"
          color={props.selected ? 'primary' : undefined}
          variant={props.selected ? 'contained' : undefined}
          className={classes.buttonSquare}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <div className={classes.buttonContents}>
            {/*<ArrowDropUpIcon/>*/}
            <img src={image} className={classes.image} alt={props.label} />
            <Typography>{props.label}</Typography>
          </div>
        </Button>
        <LazyEvaluationWrapper evaluate={openDialog}>
          <DrawerDialog
            type={props.type}
            label={props.label}
            nodeClass={nodeClass}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            closeDrawerFunction={closeDrawerFunction}
          />
        </LazyEvaluationWrapper>
      </div>
    </React.Fragment>
  );
}

function LazyEvaluationWrapper(props) {
  const { evaluate } = props;

  if (evaluate) {
    return props.children;
  }

  return null;
}

export default DrawerButton;
