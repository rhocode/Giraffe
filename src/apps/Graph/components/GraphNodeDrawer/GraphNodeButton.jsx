import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { baseTheme } from '../../../../theme';
import { getTranslate } from 'react-localize-redux';
import GraphNodeDialog from './GraphNodeDialog';

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
    margin: baseTheme.overrides.GraphAddMachineButton.margin
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

function GraphNodeButton(props) {
  const { classes, nodeClass, closeDrawerFunction } = props;
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <React.Fragment>
      <div className={classes.buttonContainer}>
        <Button
          size="large"
          color={props.selected ? 'primary' : null}
          variant={props.selected ? 'contained' : null}
          className={classes.buttonSquare}
          onClick={() => setOpenDialog(true)}
        >
          <div className={classes.buttonContents}>
            {/*<ArrowDropUpIcon/>*/}
            <img
              src={nodeClass.icon}
              className={classes.image}
              alt={props.label}
            />
            <Typography>{props.label}</Typography>
          </div>
        </Button>
        {// workaround to get the open dialog to prevent scrolling
        openDialog ? (
          <GraphNodeDialog
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

function mapStateToProps(state) {
  // return {
  //   drawerOpen: state.graphReducer.mouseMode === 'add'
  // };
  return {
    translate: getTranslate(state.localize)
  };
}

function mapDispatchToProps(dispatch) {
  // return {
  //   setOpenDialog: (data) => dispatch(setOpenDialog(data))
  // };
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphNodeButton));
