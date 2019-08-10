import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { isMobile, BrowserView, MobileView } from 'react-device-detect';
import SelectDropdown from '../../../../common/react/SelectDropdown';
import { getTranslate } from 'react-localize-redux';
import {
  addOpenedModal,
  closeOpenedModal
} from '../../../../redux/actions/Graph/graphActions';
import NativeSelect from '@material-ui/core/NativeSelect';

const styles = theme => ({
  default: {
    zIndex: theme.zIndex.drawer
  },
  inlineLabel: {
    display: 'inline-block',
    marginRight: 10
  },
  openDialog: {
    minWidth: 300
  },
  select: {
    marginBottom: 10
  }
});

function GraphNodeDialog(props) {
  const { classes, nodeClass, translate, openDialog, setOpenDialog } = props;
  const [upgradeLevel, setUpgradeLevel] = React.useState(
    nodeClass.instances[0].tier.name
  );

  useEffect(() => {
    props.addOpenedModal();
    return () => props.closeOpenedModal();
  }, [props]);

  const [resource, setResource] = React.useState('');

  const recipes = nodeClass.recipes
    .map(recipe => {
      return recipe.name;
    })
    .flat(1)
    .map(item => {
      return { label: props.translate(item), value: item };
    })
    .sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

  return (
    <Dialog
      open={openDialog}
      fullScreen={isMobile}
      onClose={() => {
        setOpenDialog(false);
      }}
    >
      <DialogTitle>{props.label} Settings</DialogTitle>
      <DialogContent className={classes.openDialog}>
        <InputLabel className={classes.inlineLabel} htmlFor="upgradeLevel">
          Tier:{' '}
        </InputLabel>
        <BrowserView>
          <Select
            value={upgradeLevel}
            className={classes.select}
            disabled={!nodeClass.hasUpgrades}
            onChange={e => setUpgradeLevel(e.target.value)}
            inputProps={{
              name: 'upgradeLevel',
              id: 'upgradeLevel'
            }}
          >
            {nodeClass.instances.map(instance => {
              const tier = instance.tier;
              return (
                <MenuItem key={tier.name} value={tier.name}>
                  {translate(tier.name)}
                </MenuItem>
              );
            })}
          </Select>
        </BrowserView>
        <MobileView>
          <NativeSelect
            value={upgradeLevel}
            className={classes.select}
            disabled={!nodeClass.hasUpgrades}
            onChange={e => setUpgradeLevel(e.target.value)}
            inputProps={{
              name: 'upgradeLevel',
              id: 'upgradeLevel'
            }}
          >
            {nodeClass.instances.map(instance => {
              const tier = instance.tier;
              return (
                <option key={tier.name} value={tier.name}>
                  {translate(tier.name)}
                </option>
              );
            })}
          </NativeSelect>
        </MobileView>

        {/*<DialogContentText>Optional: Select resource</DialogContentText>*/}
        <SelectDropdown
          selectProps={{
            classes: {
              paper: {
                zIndex: 9999
              },
              valueContainer: {
                zIndex: 9999
              }
            }
          }}
          onChange={e => {
            setResource(e.target.value);
          }}
          classProp={classes.textField}
          onKeyDown={e => {
            if (e.target.value === '' || e.target.value === undefined) {
              setResource('');
            }
          }}
          value={resource === '' ? '' : props.translate(resource)}
          label={'Optional: Recipe Name'}
          suggestions={recipes}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button color="primary" onClick={() => setOpenDialog(false)}>
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state) {
  // return {
  //   drawerOpen: state.graphReducer.mouseMode === 'add'
  // };
  return {
    translate: getTranslate(state.localize)
  };
}

function mapDispatchToProps(dispatch) {
  // return {
  //   setOpenDialog: (data) => dispatch(setOpenDialog(data))
  // };
  return {
    addOpenedModal: () => dispatch(addOpenedModal()),
    closeOpenedModal: () => dispatch(closeOpenedModal())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GraphNodeDialog));
