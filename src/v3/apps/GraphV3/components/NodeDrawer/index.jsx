import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import DomainIcon from '@material-ui/icons/Domain';
import CategoryIcon from '@material-ui/icons/Category';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { LocaleContext } from '../../../../components/LocaleProvider';
import { useStoreState } from 'pullstate';
import { graphAppStore } from '../../stores/graphAppStore';
import TabContainer from './TabContainer';
import DrawerButton from './DrawerButton';

const styles = theme => ({
  default: {
    zIndex: theme.zIndex.drawer
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
    pointerEvents: 'none'
  },
  navigation: {
    borderRadius: 5,
    pointerEvents: 'auto'
  },
  tabContainer: {
    padding: 0,
    display: 'flex',
    overflowX: 'auto'
  },
  expandPanel: {
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    gridArea: 'bottomActions',
    position: 'relative'
  },
  noDisplay: {
    display: 'none'
  }
});

function NodeDrawer(props) {
  const { classes } = props;
  const [value, setValue] = React.useState(1);

  const { translate } = React.useContext(LocaleContext);
  const drawerOpen = useStoreState(graphAppStore, s => s.mouseMode === 'add');
  const selectedMachine = useStoreState(graphAppStore, s => s.selectedMachine);
  const placeableMachineClasses = useStoreState(
    graphAppStore,
    s => s.placeableMachineClasses
  );

  const [expanded, setExpanded] = React.useState(true);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const usedClass = drawerOpen ? classes.drawer : classes.noDisplay;

  const selectedText = selectedMachine
    ? [
        translate(selectedMachine.class.name),
        translate(selectedMachine.tier),
        translate(selectedMachine.recipe)
      ].join(' ')
    : translate('selected_none');

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
              {placeableMachineClasses.map(classObject => {
                return (
                  <DrawerButton
                    nodeClass={classObject}
                    key={classObject.name}
                    label={translate(classObject.name)}
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
            <Tab label="By Machine" icon={<DomainIcon />} disabled />
            <Tab label="By Resource" icon={<CategoryIcon />} />
          </Tabs>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Drawer>
  );
}

export default withStyles(styles)(NodeDrawer);
