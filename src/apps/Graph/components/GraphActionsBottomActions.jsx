import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import CropFreeIcon from '@material-ui/icons/CropFree';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {setMouseMode} from "../../../redux/actions/Graph/graphActions";

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
  navigation: {
    borderRadius: 5,
    pointerEvents: 'auto'
  }
});

class GraphActionsBottomActions extends Component {
  // state = {
  //   value: 'pan'
  // };

  handleChange = (event, value) => {
    this.props.setMouseMode(value)
    // this.setState({ value });
  };

  render() {
    const { classes, mouseMode } = this.props;

    return (
      <div className={classes.root}>
        <BottomNavigation
          value={mouseMode}
          onChange={this.handleChange}
          className={classes.navigation}
        >
          <BottomNavigationAction
            label="Pan"
            value="pan"
            icon={<OpenWithIcon />}
          />
          <BottomNavigationAction
            label="Select"
            value="select"
            icon={<CropFreeIcon />}
          />
          <BottomNavigationAction
            label="Link"
            value="link"
            icon={<DeviceHubIcon />}
          />
        </BottomNavigation>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mouseMode: state.graphReducer.mouseMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMouseMode: (data) => dispatch(setMouseMode(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphActionsBottomActions));
