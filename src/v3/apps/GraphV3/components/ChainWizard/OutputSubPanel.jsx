import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function OutputSubPanel() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListSubheader disableSticky>Resources Required</ListSubheader>
      <ListItem>blah</ListItem>
      <ListSubheader disableSticky>Resources Produced</ListSubheader>
      <ListItem>blah</ListItem>
      <ListSubheader disableSticky>Recipes Used</ListSubheader>
      <ListItem>blah</ListItem>
      <ListSubheader disableSticky>Residuals</ListSubheader>
      <ListItem>blah</ListItem>
    </List>
  );
}

export default OutputSubPanel;
