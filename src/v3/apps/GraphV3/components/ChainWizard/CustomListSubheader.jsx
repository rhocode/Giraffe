import ListSubheader from '@material-ui/core/ListSubheader';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 5,
    paddingBottom: 10,
    color: theme.palette.text.primary,
  },
}));

function CustomListSubheader(props) {
  const classes = useStyles();
  const { children, ...restProps } = props;
  return (
    <ListSubheader {...restProps} classes={classes}>
      <Typography>{children}</Typography>
    </ListSubheader>
  );
}

export default CustomListSubheader;
