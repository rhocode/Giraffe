import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {connect} from 'react-redux';
import LoadingBar from "../../common/react/LoadingBar";

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

class HubApp extends Component {
  state = {
    status: 'Logged out'
  };

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <LoadingBar/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HubApp));
