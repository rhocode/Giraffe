import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';
import {
  setGraphData,
  setRightPanelOpen
} from '../../../redux/actions/Graph/graphActions';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1
  },
  fabMobile: {
    position: 'fixed',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1
  }
});

function GraphRightPanel(props) {
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

function mapStateToProps(state) {
  return {
    selectMode: state.graphReducer.mouseMode === 'select'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGraphData: data => dispatch(setGraphData(data)),
    setDrawerOpen: data => dispatch(setRightPanelOpen(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphRightPanel));
