import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CropFreeIcon from "@material-ui/icons/CropFree";
// import LinkIcon from "@material-ui/icons/Link";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import { motion, useAnimation } from "framer-motion";
import React from "react";
import MouseState from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState";
import { PixiJSCanvasContext } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext";
import { pixiJsStore } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore";

const useStyles = makeStyles((theme) => ({
  default: {
    zIndex: theme.zIndex.drawer,
  },
  root: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: theme.zIndex.drawer + 1,
  },
  navigation: {
    borderRadius: 5,
    pointerEvents: "auto",
  },
}));

function ActionBar() {
  const classes = useStyles();
  const domRef = React.useRef();

  const { mouseState, pixiCanvasStateId } = React.useContext(
    PixiJSCanvasContext
  );

  React.useEffect(() => {
    if (!domRef.current) return;

    pixiJsStore.update((t) => {
      const s = t[pixiCanvasStateId];
      s.aliasCanvasObjects.add(domRef.current);
    });
  }, [domRef, pixiCanvasStateId]);

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

  const controls = useAnimation();

  const { canvasReady: loaded } = React.useContext(PixiJSCanvasContext);

  React.useEffect(() => {
    if (loaded) {
      controls.start("visible");
    }
  }, [controls, loaded]);

  return (
    <div className={classes.root}>
      <motion.div
        animate={controls}
        initial="hidden"
        variants={{
          visible: { y: 0 },
          hidden: { y: 200 },
        }}
      >
        <BottomNavigation
          value={mouseState}
          onChange={handleModeChange}
          className={classes.navigation}
          ref={domRef}
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
      </motion.div>
    </div>
  );
}

export default React.memo(ActionBar);
