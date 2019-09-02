import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LinkIcon from '@material-ui/icons/Link';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import CropFreeIcon from '@material-ui/icons/CropFree';
import AddIcon from '@material-ui/icons/Add';
import { setMouseMode } from '../../../redux/actions/Graph/graphActions';

const styles = theme => ({
  default: {
    zIndex: theme.zIndex.drawer
  },
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: theme.zIndex.drawer + 1
  },
  navigation: {
    borderRadius: 5,
    pointerEvents: 'auto'
  }
});

function GraphActionsBottomActions(props) {
  const { classes, mouseMode } = props;

  const handleChange = (event, value) => {
    props.setMouseMode(value);
  };

  return (
    <div className={classes.root}>
      <BottomNavigation
        value={mouseMode}
        onChange={handleChange}
        className={classes.navigation}
      >
        <BottomNavigationAction
          label="Move"
          value="move"
          icon={<OpenWithIcon />}
        />
        <BottomNavigationAction
          label="Select"
          value="select"
          icon={<CropFreeIcon />}
        />
        <BottomNavigationAction label="Link" value="link" icon={<LinkIcon />} />
        <BottomNavigationAction label="Add" value="add" icon={<AddIcon />} />
      </BottomNavigation>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    mouseMode: state.graphReducer.mouseMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMouseMode: data => dispatch(setMouseMode(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphActionsBottomActions));
