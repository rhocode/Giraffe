import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

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
  buttonContents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  icon: {
    color: '#333'
  }
});

function GraphAppBarButton(props) {
  const {classes} = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  // function setOpenDialog(event, newValue) {
  //   setValue(newValue);
  // }

  return (
    <React.Fragment>
      <IconButton onClick={() => setOpenDialog(true)} className={classes.icon}>
        {props.icon}
      </IconButton>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{props.label}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenDialog(false)}>
            Close
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
)(withStyles(styles)(GraphAppBarButton));
