import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
  fabMobile: {
    position: 'absolute',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const fabAction = () => {
  // TODO: add graph actions.
};

function DebugFab() {
  const classes = useStyles();

  return (
    <Fab
      color="primary"
      className={isMobile ? classes.fabMobile : classes.fab}
      onClick={fabAction}
    >
      <SettingsApplicationsIcon />
    </Fab>
  );
}

export default DebugFab;
