import AppBar from '@material-ui/core/AppBar';
import {withStyles} from '@material-ui/core';
import React, {Component} from 'react';
import {connect} from "react-redux";

const styles = theme => ({
  appBarUpdateAvailable: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height,
    marginTop: theme.overrides.common.HeaderMessaging.height,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height
  }
});

class GraphAppBar extends Component {
  render() {
    const { classes, updateAvailable } = this.props;

    return (
      <AppBar position="fixed" className={updateAvailable ? classes.appBarUpdateAvailable : classes.appBar}>
        Hello!
      </AppBar>
    );
  }
}


const mapStateToProps = state => ({
  updateAvailable: state.commonReducer.updateAvailable
});

export default connect(
  mapStateToProps
)(withStyles(styles)(GraphAppBar));
