import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import {withStyles} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CategoryIcon from '@material-ui/icons/Category';

import DomainIcon from '@material-ui/icons/Domain';
import React from 'react';
import {PixiJSCanvasContext} from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext";
import {LocaleContext} from 'v3/components/LocaleProvider';
import {getBuildableMachineClassNames} from "v3/data/loaders/buildings";
import DrawerButton from './DrawerButton';
import TabContainer from './TabContainer';

const styles = (theme) => ({
  default: {
    zIndex: theme.zIndex.drawer,
  },
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  navigation: {
    borderRadius: 5,
    pointerEvents: 'auto',
  },
  tabContainer: {
    padding: 0,
    display: 'flex',
    overflowX: 'auto',
  },
  expandPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawer: {
    gridArea: 'bottomActions',
    position: 'relative',
    overflow: 'hidden',
  },
  noDisplay: {
    display: 'none',
  },
});

function NodeDrawer(props) {
  const { classes } = props;
  const [value, setValue] = React.useState(0);

  const { translate } = React.useContext(LocaleContext);
  const drawerOpen = true; //useStoreState(graphAppStore, s => s.mouseMode === 'add');


  const { selectedMachine } = React.useContext(PixiJSCanvasContext);

  const placeableMachineClasses = getBuildableMachineClassNames().sort((a, b) => {
    return translate(a).localeCompare(translate(b));
  })

  const [expanded, setExpanded] = React.useState(true);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const usedClass = drawerOpen ? classes.drawer : classes.noDisplay;

  // ?????????????
  const selectedText = translate('selected_none');
    // selectedMachine
    // ? [
    //     translate(selectedMachine.class.name),
    //     translate(selectedMachine.tier),
    //     translate(selectedMachine.recipe),
    //   ].join(' ')
    // : translate('selected_none');

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => {}}
      classes={{ paper: usedClass }}
      variant="persistent"
    >
      <ExpansionPanel
        expanded={expanded}
        onChange={(event, expanded) => {
          setExpanded(expanded);
        }}
        TransitionProps={{ unmountOnExit: true }}
      >
        <ExpansionPanelSummary
          expandIcon={drawerOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          <Typography>
            {`${translate('currently_selected')} `}
            <span className={classes.current}>{selectedText}</span>
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.expandPanel}>
          {value === 0 && (
            <TabContainer {...props} classes={classes}>
              {placeableMachineClasses.map((buildingSlug) => {
                return (
                  <DrawerButton
                    nodeClass={buildingSlug}
                    key={buildingSlug}
                    label={translate(buildingSlug)}
                    closeDrawerFunction={setExpanded}
                  />
                );
              })}
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer classes={classes}>
              <TextField id="resource-search" label="Find Resource" fullWidth />
              <Button>Add...</Button>
            </TabContainer>
          )}
          <Tabs
            variant="fullWidth"
            scrollButtons="auto"
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="By Machine" icon={<DomainIcon />} />
            <Tab label="By Resource" icon={<CategoryIcon />} />
          </Tabs>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Drawer>
  );
}

export default withStyles(styles)(NodeDrawer);
