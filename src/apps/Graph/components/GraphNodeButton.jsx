import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { baseTheme } from '../../../theme';

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
  }
});

function GraphNodeButton(props) {
  const { classes } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  // function setOpenDialog(event, newValue) {
  //   setValue(newValue);
  // }

  return (
    <React.Fragment>
      <Button
        size="large"
        color={props.selected ? 'primary' : null}
        variant={props.selected ? 'contained' : null}
        className={classes.buttonSquare}
        onClick={() => setOpenDialog(true)}
      >
        <div className={classes.buttonContents}>
          <ArrowDropUpIcon />
          <img src={props.image} className={classes.image} alt={props.label} />
          <Typography>{props.label}</Typography>
        </div>
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{props.label} Settings</DialogTitle>
        <DialogContent>
          <Button>Select {props.label} Variant</Button>
          <Menu open={false}>
            <MenuItem>stuff</MenuItem>
            <MenuItem>stuff</MenuItem>
          </Menu>
          <DialogContentText>Optional: Select resource</DialogContentText>
          <TextField id="resource-search" label="Find Resource" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="primary" onClick={() => setOpenDialog(false)}>
            Set
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  // return {
  //   drawerOpen: state.graphReducer.mouseMode === 'add'
  // };
  return {};
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
