import AppBar from '@material-ui/core/AppBar';
import {withStyles} from '@material-ui/core';
import React, {Component} from 'react';
import {connect} from "react-redux";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height,
    gridArea: 'header',
    position: 'inherit',
    top: 'auto',
    left: 'auto',
    right: 'auto'
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


const mapStateToProps = () => ({
});

export default connect(
  mapStateToProps
)(withStyles(styles)(GraphAppBar));
