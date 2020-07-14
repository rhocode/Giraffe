import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import { isMobile } from 'react-device-detect';

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
}));

const actions = [
  { icon: <StopIcon />, name: 'Stop' },
  { icon: <PauseIcon />, name: 'Pause' },
  { icon: <ReplayIcon />, name: 'Reset' },
];

function SimulationFab() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (evt, source) => {
    if (source === 'mouseLeave') return;

    setOpen(false);
  };

  return (
    // <Fab
    //   color="primary"
    //   className={isMobile ? classes.fabMobile : classes.fab}
    //   onClick={fabAction}
    // >
    //   <SettingsApplicationsIcon />
    // </Fab>

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
  );
}

export default React.memo(SimulationFab);
