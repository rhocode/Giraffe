import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import DomainIcon from '@material-ui/icons/Domain';
import CategoryIcon from '@material-ui/icons/Category';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GraphNodeButton from './GraphNodeButton';

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
    padding: 0
  },
  expandPanel: {
    display: 'flex',
    flexDirection: 'column'
  }
});

function TabContainer(props, classes) {
  return <div className={classes.tabContainer}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

function GraphNodeDrawer(props) {
  const { classes, drawerOpen } = props;
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => {}}
      variant="persistent"
      PaperProps={{}}
      classes={{ root: { color: 'red' } }}
    >
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
        <ExpansionPanelSummary
          expandIcon={drawerOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          <Typography>
            Currently Selected:{' '}
            <span className={classes.current}>Assembler</span>
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.expandPanel}>
          {value === 0 && (
            <TabContainer class={classes}>
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Constructor"
              />
              <GraphNodeButton
                selected
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Assembler.png"
                label="Assembler"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Manufacturer.png"
                label="Manufacturer"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Smelter.png"
                label="Smelter"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Foundry_MK1.png"
                label="Foundry"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Oil_Refinery.png"
                label="Refinery"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Miner_MK1.png"
                label="Miners"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Splitter.png"
                label="Logistics"
              />
            </TabContainer>
          )}
          {value === 1 && <TabContainer>test 2</TabContainer>}
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
            <Tab label="By Resource" icon={<CategoryIcon />} disabled />
          </Tabs>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Drawer>
  );
}

function mapStateToProps(state) {
  return {
    drawerOpen: state.graphReducer.mouseMode === 'add'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // setDrawerState: (data) => dispatch(setDrawerState(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphNodeDrawer));
