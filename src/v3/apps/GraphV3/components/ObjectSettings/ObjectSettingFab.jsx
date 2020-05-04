import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';
// import {
//   setGraphData,
//   setRightPanelOpen
// } from '../../../../../../redux/actions/Graph/graphActions';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1
  },
  fabMobile: {
    position: 'absolute',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1
  }
});

function ObjectSettingFab(props) {
  const { classes, setDrawerOpen } = props;

  if (props.selectMode) {
    return (
      <Fab
        color="primary"
        className={isMobile ? classes.fabMobile : classes.fab}
        onClick={() => setDrawerOpen(true)}
      >
        <SettingsApplicationsIcon />
      </Fab>
    );
  }

  return <div />;
}

export default withStyles(styles)(ObjectSettingFab);
