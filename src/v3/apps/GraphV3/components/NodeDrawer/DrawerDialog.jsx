import React, { useLayoutEffect } from 'react';
import { withStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import NativeSelect from '@material-ui/core/NativeSelect';
import { LocaleContext } from '../../../../components/LocaleProvider';
import { graphAppStore } from '../../stores/graphAppStore';
import SelectDropdown from '../../../../components/SelectDropdown';

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

const addOpenedModal = () =>
  graphAppStore.update(s => {
    s.openedModal += 1;
  });

const removeOpenedModal = () =>
  graphAppStore.update(s => {
    s.openedModal -= 1;
  });

function DrawerDialog(props) {
  const {
    classes,
    nodeClass,
    openDialog,
    setOpenDialog,
    closeDrawerFunction
  } = props;
  const [upgradeLevel, setUpgradeLevel] = React.useState(
    nodeClass.instances[0].tier.name
  );

  const { translate } = React.useContext(LocaleContext);

  useLayoutEffect(() => {
    addOpenedModal();
    return () => removeOpenedModal();
  }, []);

  const [resource, setResource] = React.useState('');

  const recipes = nodeClass.recipes
    .map(recipe => {
      return recipe.id;
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
        <Button
          color="primary"
          onClick={() => {
            graphAppStore.update(s => {
              s.selectedMachine = {
                recipe: resource,
                class: nodeClass,
                tier: upgradeLevel
              };
            });
            setOpenDialog(false);
            closeDrawerFunction(false);
          }}
        >
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(DrawerDialog);
