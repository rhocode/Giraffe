import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import { Typography } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CategoryIcon from '@material-ui/icons/Category';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';

const styles = theme => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width * 1.5,
    marginTop: theme.overrides.GraphAppBar.height
  },
  drawerContent: {
    padding: 20
  },
  tabContent: {
    padding: 20
  },
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
  const [tabValue, setTabValue] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  const { classes } = props;

  return (
    <React.Fragment>
      <Drawer
        //variant={isMobile ? "permanent" : "temporary" }
        variant="temporary"
        anchor={'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{
          paper: classes.drawer
        }}
      >
        <div className={classes.drawerContent}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            variant="fullWidth"
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Nodes" icon={<CategoryIcon />} />
            <Tab label="Edges" icon={<DeviceHubIcon />} />
          </Tabs>
          {tabValue === 0 && (
            <div className={classes.tabContent}>
              <Typography variant="h5">Node Settings</Typography>
            </div>
          )}
          {tabValue === 1 && (
            <div className={classes.tabContent}>
              <Typography variant="h5">Edge Settings</Typography>
            </div>
          )}
        </div>
      </Drawer>
      {props.selectMode ? (
        <Fab
          color="primary"
          className={isMobile ? classes.fabMobile : classes.fab}
          onClick={() => setDrawerOpen(true)}
        >
          <SettingsApplicationsIcon />
        </Fab>
      ) : (
        <div />
      )}
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    selectMode: state.graphReducer.mouseMode === 'select'
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphRightPanel));
