import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height
  }
});

class GraphAppBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" className={classes.appBar}>
        Hello!
      </AppBar>
    );
  }
}

export default withStyles(styles)(GraphAppBar);
