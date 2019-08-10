import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    button: {
      marginLeft: 10
    },
    textField: {
      margin: 0
    },
    flexDiv: {
      display: 'flex'
    }
  };
};

class AddRowModal extends Component {
  state = {
    value: '',
    buttonDisabled: false
  };

  changeValue = event => {
    const blacklist = this.props.blackList;
    let buttonDisabled = false;
    let errorMessage = '';

    const value = event.target.value;

    if (blacklist.includes(value)) {
      buttonDisabled = true;
      errorMessage = `Identifier ${value} already exists!`;
    }

    this.setState({ value, buttonDisabled, errorMessage });
  };

  buttonAction = () => {
    const blacklist = this.props.blackList;
    if (!blacklist.includes(this.state.value)) {
      this.props
        .addItemAction(null, this.state.value)
        .then(() => {
          this.props.handleClose();
          this.setState({ value: '' });
        })
        .catch(err => {
          this.setState({ buttonDisabled: true, errorMessage: err });
        });
    }
  };

  render() {
    const { open, handleClose, classes } = this.props;
    const { value, buttonDisabled } = this.state;

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className={classes.paper}>
          <div className={classes.flexDiv}>
            <TextField
              id="outlined-name"
              label="Identifier"
              className={classes.textField}
              value={value}
              onChange={this.changeValue}
              margin="normal"
              variant="outlined"
              error={buttonDisabled}
            />
            <Button
              disabled={buttonDisabled}
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.buttonAction}
            >
              Create
            </Button>
          </div>
          <div hidden={!buttonDisabled} className={classes.fullWidth}>
            {this.state.errorMessage}
          </div>
          {/*Oopsie woopsie!! uwu we made a fucky wucky!! a wittwe fucko boingo! da code monkeys at ouw headquawtews awe wowking vewy hawd to fix dis!*/}
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
