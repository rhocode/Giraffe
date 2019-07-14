import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height,
    gridArea: 'header',
    position: 'inherit',
    top: 'auto',
    left: 'auto',
    right: 'auto'
  },
  logo: {
    paddingTop: 15,
    paddingLeft: 15
  }
});

class GraphAppBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" className={classes.appBar}>
        <img
          src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory2.png"
          alt="Satisgraphtory!"
          width="300"
          className={classes.logo}
        />
      </AppBar>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(GraphAppBar));
