import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { motion, useAnimation } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  fabMotion: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  fab: {
    position: 'absolute',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
    pointerEvents: 'auto',
  },
  fabMobile: {
    position: 'absolute',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
    pointerEvents: 'auto',
  },
}));

const fabAction = () => {
  // TODO: add graph actions.
  pixiJsStore.update((s) => {
    console.log(s);
    console.log(Object.keys(Object.values(s)));

    // .map((val) => {
    //     val.mouseMode = MouseState.SELECT;
    //   });
  });
};

function DebugFab() {
  const classes = useStyles();

  const controls = useAnimation();

  const { canvasReady: loaded } = React.useContext(PixiJSCanvasContext);

  React.useEffect(() => {
    if (loaded) {
      controls.start('visible');
    }
  }, [controls, loaded]);

  return (
    <motion.div
      className={classes.fabMotion}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { x: 0 },
        hidden: { x: 100 },
      }}
    >
      <Fab
        color="primary"
        className={isMobile ? classes.fabMobile : classes.fab}
        onClick={fabAction}
      >
        <SettingsApplicationsIcon />
      </Fab>
    </motion.div>
  );
}

export default React.memo(DebugFab);
