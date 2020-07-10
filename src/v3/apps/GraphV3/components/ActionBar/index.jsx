import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import LinkIcon from "@material-ui/icons/Link";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import CropFreeIcon from '@material-ui/icons/CropFree';
import AddIcon from '@material-ui/icons/Add';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';

const useStyles = makeStyles((theme) => ({
  default: {
    zIndex: theme.zIndex.drawer,
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
    zIndex: theme.zIndex.drawer + 1,
  },
  navigation: {
    borderRadius: 5,
    pointerEvents: 'auto',
  },
}));

function ActionBar() {
  const classes = useStyles();

  const { mouseState, pixiCanvasStateId } = React.useContext(
    PixiJSCanvasContext
  );

  const handleModeChange = React.useCallback(
    (event, value) => {
      pixiJsStore.update((s) => {
        if (value !== s[pixiCanvasStateId].mouseMode) {
          s[pixiCanvasStateId].mouseState = value;
        }
      });
    },
    [pixiCanvasStateId]
  );

  return (
    <div className={classes.root}>
      <BottomNavigation
        value={mouseState}
        onChange={handleModeChange}
        className={classes.navigation}
      >
        <BottomNavigationAction
          label="Move"
          value={MouseState.MOVE}
          icon={<OpenWithIcon />}
        />
        <BottomNavigationAction
          label="Select"
          value={MouseState.SELECT}
          icon={<CropFreeIcon />}
        />
        {/*<BottomNavigationAction*/}
        {/*  label="Link"*/}
        {/*  value="link"*/}
        {/*  icon={<LinkIcon />} />*/}
        <BottomNavigationAction
          label="Add"
          value={MouseState.ADD}
          icon={<AddIcon />}
        />
      </BottomNavigation>
    </div>
  );
}

export default ActionBar;
