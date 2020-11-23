import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
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
  buttonContents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    color: '#333',
  },
  dialogRoot: {
    maxWidth: 700,
  },
});

function IconDialog(props) {
  const { classes, disabled } = props;
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <React.Fragment>
      <IconButton
        disabled={disabled}
        onClick={() => setOpenDialog(true)}
        className={classes.icon}
      >
        {props.icon}
      </IconButton>
      <Dialog
        classes={{ paper: classes.dialogRoot }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
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

export default withStyles(styles)(IconDialog);
