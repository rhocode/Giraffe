import AppBar from '@material-ui/core/AppBar';
import { Toolbar, withStyles } from '@material-ui/core';
import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import satisgraphtory2 from '../../../../../images/satisgraphtory2.png';
import satisgraphtory2_square from '../../../../../images/satisgraphtory2_square.png';

import ShareButton from './ShareButton';
import SettingsButton from './SettingsButton';
import HelpButton from './HelpButton';

const styles = (theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    minHeight: theme.overrides.GraphAppBar.height,
    gridArea: 'header',
    position: 'inherit',
    top: 'auto',
    left: 'auto',
    right: 'auto',
  },
  logo: {
    width: 300,
  },
  logoSmall: {
    width: 30,
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    minHeight: theme.overrides.GraphAppBar.height,
  },
  margin: {
    padding: theme.spacing(0, 3),
  },
});

function NarBar(props) {
  const { classes } = props;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar classes={{ root: classes.toolbar }}>
        <Hidden xsDown implementation="css">
          <Badge
            className={classes.margin}
            badgeContent={'Pre-Alpha'}
            color="secondary"
          >
            <img
              src={satisgraphtory2}
              alt="Satisgraphtory!"
              className={classes.logo}
            />
          </Badge>
        </Hidden>
        <Hidden smUp implementation="css">
          <img
            src={satisgraphtory2_square}
            alt="Satisgraphtory!"
            className={classes.logoSmall}
          />
        </Hidden>
        <div className={classes.grow} />
        <ShareButton />
        <SettingsButton />
        <HelpButton />
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(NarBar);
