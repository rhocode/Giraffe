import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const styles = theme => ({
  default: {
    zIndex: theme.zIndex.drawer
  },
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  image: {
    height: 50
  },
  buttonSquare: {
    minWidth: 140,
    minHeight: 140,
    margin: 10
  },
  buttonContents: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
});

function TabContainer(props, classes) {
  return <div className={classes.tabContainer}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

function GraphNodeButton(props) {
  const { classes } = props;
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <React.Fragment>
      <Button
        size="large"
        color={props.selected ? 'primary' : null}
        variant={props.selected ? 'contained' : null}
        className={classes.buttonSquare}
      >
        <div className={classes.buttonContents}>
          <ArrowDropUpIcon />
          <img src={props.image} className={classes.image} alt={props.label} />
          <Typography>{props.label}</Typography>
        </div>
      </Button>
      <Menu open={false}>
        <MenuItem>stuff</MenuItem>
        <MenuItem>stuff</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    drawerOpen: state.graphReducer.mouseMode === 'add'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // setDrawerState: (data) => dispatch(setDrawerState(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphNodeButton));
