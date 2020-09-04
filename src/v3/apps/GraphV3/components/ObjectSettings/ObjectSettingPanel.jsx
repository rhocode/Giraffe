import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Divider,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import DeleteIcon from '@material-ui/icons/Delete';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import RemoveIcon from '@material-ui/icons/Remove';
import React from 'react';
import Scrollbar from 'react-scrollbars-custom';
import SelectDropdown from '../../../../../common/react/SelectDropdown';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width * 2,
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
    gridArea: 'nodeSettingArea',
    display: 'grid',
  },
  drawerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexGrow: 1,
  },
  tabContent: {
    padding: 20,
    pointerEvents: 'auto',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flexGrow: 1,
  },
  fab: {
    position: 'fixed',
    bottom: '2em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
  fabMobile: {
    position: 'fixed',
    bottom: '7em',
    right: '2em',
    zIndex: theme.zIndex.drawer + 1,
  },
  overclockTextField: {
    minWidth: 80,
    // width: 100
  },
  // overclockRow: {
  //   flexDirection: 'row'
  // },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  expandPanel: {
    flexDirection: 'column',
  },
  tiers: {
    flexDirection: 'column',
  },
  buttonText: {
    // color: 'white',
  },
  root: {
    // pointerEvents: 'auto'
  },
}));

const CustomOutlinedInput = ({
  color,
  disableElevation,
  disableRipple,
  disableFocusRipple,
  ...otherProps
}) => <OutlinedInput {...otherProps} />;

const StyledInput = withStyles(() => ({
  input: {
    borderRadius: 0,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    width: 80,
    height: '0em',
  },
  root: {
    padding: 0,
  },
}))(CustomOutlinedInput);

function ObjectSettingPanel(props) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  // drawerOpen
  const { setDrawerOpen } = props;

  return (
    <Drawer
      // variant={isMobile ? "permanent" : "temporary" }
      variant="permanent"
      anchor={'right'}
      // open={drawerOpen}
      open={false}
      onClose={() => setDrawerOpen(false)}
      classes={{
        paper: classes.drawer,
        root: classes.root,
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
          <Scrollbar>
            <div className={classes.tabContent}>
              <Typography variant="h5">All Node Settings</Typography>
              <Divider className={classes.divider} />
              <Button
                color="secondary"
                variant="contained"
                // onClick={() => {
                //   const newSelection = removeNodes(
                //     Object.values(props.selectedData.nodes || {}),
                //     props.graphData
                //   );
                //   props.setGraphData(newSelection);
                // }}
                startIcon={<DeleteIcon />}
              >
                Delete ALL selected nodes
              </Button>
              <Divider className={classes.divider} />

              <Typography variant="h6">Set ALL Node Tiers</Typography>
              <div className={classes.tiers}>
                {/* <Typography variant="body1"> */}
                <ButtonGroup disableElevation fullWidth>
                  <Button color="secondary" className={classes.iconButton}>
                    <FastRewindIcon />
                  </Button>
                  <Button
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    className={classes.buttonText}
                  >
                    Mark 1
                  </Button>
                  <Button color="primary" className={classes.iconButton}>
                    <FastForwardIcon />
                  </Button>
                </ButtonGroup>
                {/* </Typography> */}
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
              <Accordion square>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Miners</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.expandPanel}>
                  <Typography variant="body1">Recipe</Typography>
                  <SelectDropdown fullWidth />
                  <Divider className={classes.divider} />

                  {/* <div className={classes.tiers}> */}
                  <Typography variant="body1">Machine Level</Typography>
                  <ButtonGroup fullWidth disableElevation>
                    <Button color="secondary" className={classes.iconButton}>
                      <FastRewindIcon />
                    </Button>
                    <Button color="secondary" className={classes.iconButton}>
                      <RemoveIcon />
                    </Button>
                    <Button
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      className={classes.buttonText}
                    >
                      Mark 1
                    </Button>
                    <Button color="primary" className={classes.iconButton}>
                      <AddIcon />
                    </Button>
                    <Button color="primary" className={classes.iconButton}>
                      <FastForwardIcon />
                    </Button>
                  </ButtonGroup>
                  {/* </div> */}
                  <Divider className={classes.divider} />

                  <Typography variant="body1">
                    Miner Efficiency (Overclock %)
                  </Typography>
                  <div className={classes.overclockRow}>
                    <ButtonGroup disableElevation fullWidth>
                      <Button color="secondary" className={classes.iconButton}>
                        <FastRewindIcon />
                      </Button>
                      <Button color="secondary" className={classes.iconButton}>
                        <RemoveIcon />
                      </Button>
                      {/* <Button>
                        <FormControl>
                          <Input
                            id="overclock-val"
                            label="Overclock"
                            className={classes.overclockTextField}
                            variant="outlined"
                            value={''}
                            endAdornment={
                              <InputAdornment position="end">%</InputAdornment>
                            }
                            // onChange={}
                          />
                          <FormHelperText id="standard-weight-helper-text">
                            Overclock
                          </FormHelperText>
                        </FormControl>
                      </Button> */}
                      <StyledInput className={classes.overclockTextField} />
                      <Button color="primary" className={classes.iconButton}>
                        <AddIcon />
                      </Button>
                      <Button color="primary" className={classes.iconButton}>
                        <FastForwardIcon />
                      </Button>
                    </ButtonGroup>
                    {/* <Slider
                      classes={classes.slider}
                      // value={}
                      min={0}
                      max={250}
                      step={1}
                      // onChange={}
                    /> */}
                  </div>
                </AccordionDetails>
                <AccordionActions>
                  <Button color="secondary" variant="contained">
                    <DeleteIcon />
                  </Button>
                </AccordionActions>
              </Accordion>
              <Accordion square>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Constructors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">Recipe</Typography>
                </AccordionDetails>
                <AccordionActions>
                  <Button color="secondary" variant="contained">
                    <DeleteIcon />
                  </Button>
                </AccordionActions>
              </Accordion>
              {/* <Divider className={classes.divider} /> */}
            </div>
          </Scrollbar>
        )}
        {tabValue === 1 && (
          <Scrollbar>
            <div className={classes.tabContent}>
              <Typography variant="h5">All Belt Settings</Typography>
              <Divider className={classes.divider} />

              <Button
                color="secondary"
                variant="contained"
                // onClick={() => {
                //   const newSelection = removeEdges(
                //     Object.values(props.selectedData.edges || {}),
                //     props.graphData
                //   );
                //   props.setGraphData(newSelection);
                // }}
                startIcon={<DeleteIcon />}
                // fullwidth
              >
                Delete ALL selected belts
              </Button>
              <Divider className={classes.divider} />

              <Typography variant="h6">Set ALL Belt Tiers</Typography>
              <ButtonGroup fullWidth>
                <Button color="secondary" className={classes.iconButton}>
                  <FastRewindIcon />
                </Button>
                <Button color="secondary" className={classes.iconButton}>
                  <RemoveIcon />
                </Button>
                <Button
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  className={classes.buttonText}
                >
                  Mark 1
                </Button>
                <Button color="primary" className={classes.iconButton}>
                  <AddIcon />
                </Button>
                <Button color="primary" className={classes.iconButton}>
                  <FastForwardIcon />
                </Button>
              </ButtonGroup>
              {/* <Divider className={classes.divider} /> */}
            </div>
          </Scrollbar>
        )}
      </div>
    </Drawer>
  );
}

export default ObjectSettingPanel;
