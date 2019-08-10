import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => {
  return {
    paper: {
      position: 'absolute',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2),
      outline: 'none',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%)`
    },
    leftButton: {
      marginRight: 10
    },
    rightButton: {
      marginLeft: 10
    },
    textField: {
      margin: 0
    },
    flexDiv: {
      display: 'flex'
    },
    header: {
      marginBottom: 10
    }
  };
};

class AddRowModal extends Component {
  state = {};

  buttonAction = () => {
    this.props.clickFunction();
    this.props.handleClose();
  };

  render() {
    const { open, handleClose, classes } = this.props;

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className={classes.paper}>
          <Typography className={classes.header}>
            Delete {this.props.name.trim()}?
          </Typography>
          <div className={classes.flexDiv}>
            <Button
              variant="contained"
              color="primary"
              className={classes.leftButton}
              onClick={this.buttonAction}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.rightButton}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddRowModal));
