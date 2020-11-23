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
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import SelectDropdown from '../../../../../common/react/SelectDropdown';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.overrides.GraphDrawer.width,
    marginTop: theme.overrides.GraphAppBar.height,
    height: `calc(100% - ${theme.overrides.GraphAppBar.height}px)`,
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
  },
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
    gridArea: 'anotherElement',
    display: 'grid',
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

  const {
    mouseState,
    selectedObjects,
    pixiCanvasStateId,
    applicationLoaded,
  } = React.useContext(PixiJSCanvasContext);

  const edges = selectedObjects?.filter((item) => {
    if (item instanceof EdgeTemplate) {
      return true;
    } else if (item instanceof NodeTemplate) {
      return false;
    }

    throw new Error('Not instance of something handled');
  });

  const nodes = selectedObjects?.filter((item) => {
    if (item instanceof EdgeTemplate) {
      return false;
    } else if (item instanceof NodeTemplate) {
      return true;
    }

    throw new Error('Not instance of something handled');
  });

  const numNodes = nodes?.length;
  const numEdges = edges?.length;

  React.useEffect(() => {
    if (numEdges && !numNodes) {
      setTabValue(1);
    }

    if (numNodes && !numEdges) {
      setTabValue(0);
    }
  }, [numEdges, numNodes]);

  if (!applicationLoaded) return null;

  return (
    <Drawer
      variant="persistent"
      anchor={'right'}
      open={mouseState === MouseState.SELECT && selectedObjects.length > 0}
      onClose={() => {}}
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
          <Tab
            label="Nodes"
            disabled={numNodes === 0}
            icon={<CategoryIcon />}
          />
          <Tab
            label="Edges"
            disabled={numEdges === 0}
            icon={<DeviceHubIcon />}
          />
        </Tabs>
        {tabValue === 0 && (
          <Scrollbar>
            <div className={classes.tabContent}>
              <Typography variant="h5">All Node Settings</Typography>
              <Divider className={classes.divider} />
              <Button
                onClick={() => {
                  pixiJsStore.update((t) => {
                    const s = t[pixiCanvasStateId];

                    let objectsToDelete = new Set([]);

                    for (const node of nodes) {
                      objectsToDelete.add(node);
                      const altDeletes = node.delete();
                      for (const item of altDeletes) {
                        objectsToDelete.add(item);
                      }
                    }

                    for (const obj of objectsToDelete) {
                      s.childrenMap.delete(obj.id);
                    }

                    s.children = s.children.filter(
                      (item) => !objectsToDelete.has(item)
                    );

                    s.selectedObjects = [];
                  });
                }}
                color="secondary"
                variant="contained"
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
                onClick={() => {
                  pixiJsStore.update((t) => {
                    const s = t[pixiCanvasStateId];

                    let edgesToDelete = new Set(edges);

                    for (const edge of edges) {
                      edge.delete();
                    }

                    for (const obj of edgesToDelete) {
                      s.childrenMap.delete(obj.id);
                    }

                    s.children = s.children.filter(
                      (item) => !edgesToDelete.has(item)
                    );

                    s.selectedObjects = [];
                  });
                }}
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
