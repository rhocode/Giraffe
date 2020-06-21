import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import LinkIcon from "@material-ui/icons/Link";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import CropFreeIcon from '@material-ui/icons/CropFree';
import AddIcon from '@material-ui/icons/Add';
import { useStoreState } from 'pullstate';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';

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

function ActionBar(props) {
  const { classes } = props;

  const mouseMode = useStoreState(graphAppStore, s => s.mouseMode);

  const handleChange = (event, value) => {
    graphAppStore.update(s => {
      if (value !== s.mouseMode) {
        s.mouseMode = value;
      }
    });
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
        {/*<BottomNavigationAction*/}
        {/*  label="Link"*/}
        {/*  value="link"*/}
        {/*  icon={<LinkIcon />} />*/}
        <BottomNavigationAction label="Add" value="add" icon={<AddIcon />} />
      </BottomNavigation>
    </div>
  );
}

export default withStyles(styles)(ActionBar);
