import { makeStyles } from '@material-ui/core/styles';
import PauseIcon from '@material-ui/icons/Pause';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ReplayIcon from '@material-ui/icons/Replay';
import StopIcon from '@material-ui/icons/Stop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: '2em',
    left: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
  fabMobile: {
    position: 'absolute',
    bottom: '7em',
    left: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
  fabMotion: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
}));

const actions = [
  { icon: <StopIcon />, name: 'Stop' },
  { icon: <PauseIcon />, name: 'Pause' },
  { icon: <ReplayIcon />, name: 'Reset' },
];

function SimulationFab() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (evt, source) => {
    if (source === 'toggle') {
      setOpen(true);
    }
  };

  const handleClose = (evt, source) => {
    if (source === 'toggle') {
      setOpen(false);
    }
  };

  const controls = useAnimation();

  const { canvasReady: loaded } = React.useContext(PixiJSCanvasContext);

  React.useEffect(() => {
    if (loaded) {
      const promise = controls.start('visible');
      promise.then(() => {
        setOpen(true);
      });
    }
  }, [controls, loaded]);

  return (
    // <Fab
    //   color="primary"
    //   className={isMobile ? classes.fabMobile : classes.fab}
    //   onClick={fabAction}
    // >
    //   <SettingsApplicationsIcon />
    // </Fab>
    <div className={classes.root}>
      <motion.div
        className={classes.fabMotion}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { x: 0 },
          hidden: { x: -200 },
        }}
      >
        <SpeedDial
          ariaLabel="Simulation"
          className={isMobile ? classes.fabMobile : classes.fab}
          icon={<PlayCircleFilledIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              tooltipPlacement="right"
              onClick={handleClose}
              title={'Simulation Options'}
            />
          ))}
        </SpeedDial>
      </motion.div>
    </div>
  );
}

export default React.memo(SimulationFab);
