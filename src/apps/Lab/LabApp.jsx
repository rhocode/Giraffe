// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { simpleAction } from '../../redux/actions/simpleAction';
import DatabaseEditor from './components/DatabaseEditor';

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      height: '100%',
      width: '100%',
      background: 'black',
      display: 'flex'
    }
  };
};

// const CLIENT_ID = "735fd98a5386c1ab6210";
// const REDIRECT_URI = "http://localhost:3000/lab";

class LabApp extends Component {
  state = {
    status: 'Logged out'
  };

  simpleAction = event => {
    this.props.simpleAction();
  };

  componentDidMount() {
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];
    if (code) {
      this.setState({ status: 'LOADING TOKEN' });
      fetch(`https://gatekeeper.rhocode.now.sh/?code=${code}`)
        .then(response => response.json())
        .then(({ token }) => {
          this.setState({
            token,
            status: 'FINISHED:' + code + '//' + token
          });
        });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {/*<Button variant="contained" color="primary" href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`}>*/}
        {/*  Log in button: this state is: {this.state.status};*/}
        {/*</Button>*/}
        <DatabaseEditor />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LabApp));
