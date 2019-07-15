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
import { Scrollbars } from 'react-custom-scrollbars';
import {baseTheme} from "../../../theme";

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
    position: "relative"
  },
  noDisplay: {
    display: 'none'
  }
});

function TabContainer(props) {
  const { classes, children } = props;
  const scrollRef = React.useRef();

  const themeObject = baseTheme.overrides.GraphAddMachineButton;
  console.error(children.length, themeObject.width );
  return <Scrollbars ref={scrollRef} style={{ height: themeObject.width + themeObject.margin * 4, width: "100%" }}>
    <div onWheel={e => {
      if (scrollRef.current) {
        const ref = scrollRef.current;
        const currentLeft = ref.getScrollLeft() + e.deltaY;
        ref.scrollLeft(currentLeft);
      } else {
        console.error(e, e.deltaY, scrollRef.current);
      }
    }} style={{ width: children.length * (themeObject.width + (2 * themeObject.margin)) }}>
      {children}
    </div>
  </Scrollbars>;
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

  const usedClass = drawerOpen ? classes.drawer : classes.noDisplay;

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => {}}
      classes={{paper: usedClass}}
      variant="persistent"
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
            <TabContainer classes={classes}>
              <GraphNodeButton
                selected
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Assembler.png"
                label="Assembler"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Constructor"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Smelter"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Manufacturer"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Foundry"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Refinery"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
                label="Miners"
              />
              <GraphNodeButton
                image="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satoolsfactory_icons/Constructor.png"
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
