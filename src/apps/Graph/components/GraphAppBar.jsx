import AppBar from '@material-ui/core/AppBar';
import { Toolbar, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';

import GraphSettingsButton from './GraphSettingsButton';
import GraphHelpButton from './GraphHelpButton';
import GraphShareButton from './GraphShareButton';

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
    width: 300
  },
  logoSmall: {
    width: 30
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    minHeight: theme.overrides.GraphAppBar.height
  }
});

class GraphAppBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar classes={{ root: classes.toolbar }}>
          <Hidden xsDown implementation="css">
            <img
              src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory2.png"
              alt="Satisgraphtory!"
              className={classes.logo}
            />
          </Hidden>
          <Hidden smUp implementation="css">
            <img
              src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory2_square.png"
              alt="Satisgraphtory!"
              className={classes.logoSmall}
            />
          </Hidden>
          <div className={classes.grow} />
          <GraphShareButton />
          <GraphSettingsButton />
          <GraphHelpButton />
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(withStyles(styles)(GraphAppBar));
