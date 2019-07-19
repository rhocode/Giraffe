import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
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
import GraphNodeButton from './GraphNodeButton';
import {Scrollbars} from 'react-custom-scrollbars';
import {baseTheme} from "../../../theme";
import normalizeWheel from 'normalize-wheel';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {getTranslate} from "react-localize-redux";
import {urlRepository} from "../libraries/SGLib/repositories/imageRepository";

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

function TabContainer(props) {
  const {children} = props;
  const scrollRef = React.useRef();

  const themeObject = baseTheme.overrides.GraphAddMachineButton;
  return <Scrollbars ref={scrollRef} style={{height: themeObject.width + themeObject.margin * 4, width: "100%"}}>
    <div onWheel={e => {
      if (scrollRef.current) {
        const normalized = normalizeWheel(e);
        const ref = scrollRef.current;
        const currentLeft = ref.getScrollLeft() + normalized.pixelY;
        ref.scrollLeft(currentLeft);
      }
    }} style={{width: children.length * (themeObject.width + (2 * themeObject.margin))}}>
      {children}
    </div>
  </Scrollbars>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const GET_CRAFTING_MACHINE_CLASSES = gql`
  {
    getCraftingMachineClasses {
      name
      icon
    }
  }
`;

function GraphNodeDrawer(props) {
  const {classes, drawerOpen, translate} = props;
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  const usedClass = drawerOpen ? classes.drawer : classes.noDisplay;

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => {
      }}
      classes={{paper: usedClass}}
      variant="persistent"
    >
      <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
        <ExpansionPanelSummary
          expandIcon={drawerOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
        >
          <Typography>
            Currently Selected:{' '}
            <span className={classes.current}>Assembler</span>
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.expandPanel}>
          {value === 0 && (
              <Query query={GET_CRAFTING_MACHINE_CLASSES}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error! ${error.message}`;

                  const imageBaseUrl = urlRepository.machines;
                  return <TabContainer classes={classes}>
                    {
                      data.getCraftingMachineClasses.sort((machine1, machine2) => {
                        return machine1.name.localeCompare(machine2.name);
                      }).map(machine => {
                        let icon = imageBaseUrl[machine.icon];
                            if (!icon) {
                          icon = imageBaseUrl[Object.keys(imageBaseUrl)[0]];
                        }
                        return <GraphNodeButton
                          key={machine.name}
                          image={icon}
                          label={translate(machine.name)}
                        />
                      })
                    }
                  </TabContainer>

                }}
              </Query>
          )}
          {value === 1 && (
            <TabContainer classes={classes}>
              <TextField id="resource-search" label="Find Resource" fullWidth/>
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
            <Tab label="By Machine" icon={<DomainIcon/>}/>
            <Tab label="By Resource" icon={<CategoryIcon/>} disabled/>
          </Tabs>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Drawer>
  );
}

function mapStateToProps(state) {
  return {
    drawerOpen: state.graphReducer.mouseMode === 'add',
    translate: getTranslate(state.localize)
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
