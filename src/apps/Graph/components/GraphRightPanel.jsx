import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import {
  Typography,
  Button,
  TextField,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import CategoryIcon from '@material-ui/icons/Category';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import Slider from '@material-ui/core/Slider';
import Fab from '@material-ui/core/Fab';
import { isMobile } from 'react-device-detect';
import SelectDropdown from 'common/react/SelectDropdown';

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
  },
  overclockTextField: {},
  divider: {
    marginTop: 10,
    marginBottom: 10
  },
  expandPanel: {
    flexDirection: 'column'
  },
  tiers: {
    flexDirection: 'column'
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
              <Typography variant="h5">All Node Settings</Typography>
              <Divider className={classes.divider} />

              <Button color="secondary">
                <DeleteIcon /> Delete ALL selected nodes
              </Button>
              <Divider className={classes.divider} />

              <Typography variant="h6">Set ALL Node Tiers</Typography>
              <div className={classes.tiers}>
                <Typography variant="body1">
                  <IconButton color="secondary" className={classes.iconbutton}>
                    <FastRewindIcon />
                  </IconButton>
                  Mark 1
                  <IconButton color="primary" className={classes.iconbutton}>
                    <FastForwardIcon />
                  </IconButton>
                </Typography>
              </div>
              <Divider className={classes.divider} />

              {/* <Typography variant="h6">Set ALL Overclock</Typography>
              <TextField
                id="overclock-val"
                label="Overclock (%)"
                className={classes.overclockTextField}
                fullWidth
                // value={}
                // onChange={}
              />
              <Slider
                classes={classes.slider}
                // value={}
                min={0}
                max={250}
                step={1}
                // onChange={}
              />
              <Divider className={classes.divider}/> */}

              <Typography variant="h5">By Machine Class</Typography>
              <ExpansionPanel square>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Miners</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expandPanel}>
                  <Typography variant="body1">
                    Recipe
                    <SelectDropdown fullWidth></SelectDropdown>
                  </Typography>
                  <Divider className={classes.divider} />

                  <div className={classes.tiers}>
                    <Typography variant="body1">
                      <IconButton
                        color="secondary"
                        className={classes.iconbutton}
                      >
                        <FastRewindIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        className={classes.iconbutton}
                      >
                        <RemoveIcon />
                      </IconButton>
                      Mark 1
                      <IconButton
                        color="primary"
                        className={classes.iconbutton}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        className={classes.iconbutton}
                      >
                        <FastForwardIcon />
                      </IconButton>
                    </Typography>
                  </div>
                  <Divider className={classes.divider} />

                  <Typography variant="body1">
                    Miner Efficiency
                    <TextField
                      id="overclock-val"
                      label="Overclock (%)"
                      className={classes.overclockTextField}
                      fullWidth
                      // value={}
                      // onChange={}
                    />
                    <Slider
                      classes={classes.slider}
                      // value={}
                      min={0}
                      max={250}
                      step={1}
                      // onChange={}
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <IconButton color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </ExpansionPanelActions>
              </ExpansionPanel>
              <ExpansionPanel square>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Constructors</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography variant="body1">Recipe</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <IconButton color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </ExpansionPanelActions>
              </ExpansionPanel>
              <Divider className={classes.divider} />
            </div>
          )}
          {tabValue === 1 && (
            <div className={classes.tabContent}>
              <Typography variant="h5">All Belt Settings</Typography>
              <Divider className={classes.divider} />

              <Button color="secondary">
                <DeleteIcon /> Delete ALL selected belts
              </Button>
              <Divider className={classes.divider} />

              <Typography variant="h6">Set ALL Belt Tiers</Typography>
              <div className={classes.tiers}>
                <Typography variant="body1">
                  <IconButton color="secondary" className={classes.iconbutton}>
                    <FastRewindIcon />
                  </IconButton>
                  <IconButton color="secondary" className={classes.iconbutton}>
                    <RemoveIcon />
                  </IconButton>
                  Mark 1
                  <IconButton color="primary" className={classes.iconbutton}>
                    <AddIcon />
                  </IconButton>
                  <IconButton color="primary" className={classes.iconbutton}>
                    <FastForwardIcon />
                  </IconButton>
                </Typography>
              </div>
              <Divider className={classes.divider} />
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
