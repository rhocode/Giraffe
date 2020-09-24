import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { BrowserView, isMobile } from 'react-device-detect';
import ModalOpenTrigger from 'v3/apps/GraphV3/components/ModalOpenTrigger/ModalOpenTrigger';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getBuildableMachinesFromClassName } from 'v3/data/loaders/buildings';
import { getRecipesByMachine } from 'v3/data/loaders/recipes';
import SelectDropdown from '../../../../components/SelectDropdown';

const useStyles = makeStyles((theme) => ({
  default: {
    zIndex: theme.zIndex.drawer,
  },
  inlineLabel: {
    display: 'inline-block',
    marginRight: 10,
  },
  openDialog: {
    minWidth: 300,
  },
  select: {
    marginBottom: 10,
  },
}));

function DropDownWrapper(props) {
  const {
    setValue,
    value,
    choices,
    label,
    valueLabel,
    id,
    noOptionsMessage,
  } = props;

  return (
    <SelectDropdown
      {...props}
      id={id}
      selectProps={{
        classes: {
          paper: {
            zIndex: 9999,
          },
          valueContainer: {
            zIndex: 9999,
          },
        },
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.target.value === '' || e.target.value === undefined) {
          setValue(null);
        }
      }}
      noOptionsMessage={noOptionsMessage}
      value={value}
      valueLabel={valueLabel}
      label={label}
      suggestions={choices}
    />
  );
}

function MachineTypeSelector(props) {
  const { building, setBuilding, choices } = props;

  const { translate } = React.useContext(LocaleContext);

  const value = choices.filter((option) => option.value === building);

  const displayValue = building ? translate(building) : '';

  if (choices.length === 1 && displayValue) {
    return (
      <TextField
        id="BuildingLabel"
        label="Building"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        value={displayValue}
      />
    );
  } else {
    return (
      <DropDownWrapper
        id={'machine-type-selector'}
        disabled={choices.length === 1}
        choices={choices}
        value={value.length ? value[0] : ''}
        setValue={setBuilding}
        label={'Building'}
      />
    );
  }
}

function RecipeSelector(props) {
  const { recipe, setRecipe, choices, disabled } = props;

  const { translate } = React.useContext(LocaleContext);

  const value = choices.filter((option) => option.value === recipe);

  const displayValue = recipe ? translate(recipe) : '';

  if (disabled || !choices.length) {
    return null;
  }

  if (choices.length === 1 && displayValue) {
    return (
      <TextField
        disabled={disabled}
        id="RecipeLabel"
        label="Recipe"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        value={displayValue}
      />
    );
  } else {
    return (
      <DropDownWrapper
        id={'recipe-selector'}
        choices={choices}
        value={value.length ? value[0] : ''}
        setValue={setRecipe}
        label={'Recipe'}
      />
    );
  }
}

function resolveSelectedChoice(machineTypes, translate, selectedMachine) {
  const choices = machineTypes.map((slug) => {
    return { value: slug, label: translate(slug) };
  });

  const filteredChoices =
    choices.length === 1
      ? choices
      : choices.filter((item) => item.value === selectedMachine);
  const resolvedSelectedChoice = filteredChoices.length
    ? filteredChoices[0].value
    : null;
  return { choices, resolvedSelectedChoice };
}

function DrawerDialog(props) {
  const { nodeClass, openDialog, setOpenDialog, closeDrawerFunction } = props;

  const classes = useStyles();

  const { translate } = React.useContext(LocaleContext);

  const {
    selectedMachine,
    selectedRecipe,
    pixiCanvasStateId,
  } = React.useContext(PixiJSCanvasContext);

  let resolvedSelectedMachine = null;
  let machineChoices;

  let recipeChoices = [];
  let resolvedSelectedRecipe = null;

  if (props.type === 'building') {
    const machineTypes = getBuildableMachinesFromClassName(nodeClass);
    const resolvedMachineOptions = resolveSelectedChoice(
      machineTypes,
      translate,
      selectedMachine
    );
    machineChoices = resolvedMachineOptions.choices;
    resolvedSelectedMachine = resolvedMachineOptions.resolvedSelectedChoice;
  }

  const [building, setBuilding] = React.useState(resolvedSelectedMachine);

  if (props.type === 'building') {
    if (building) {
      const recipes = getRecipesByMachine(building);

      const resolvedRecipeOptions = resolveSelectedChoice(
        recipes,
        translate,
        selectedRecipe
      );
      recipeChoices = resolvedRecipeOptions.choices;
      resolvedSelectedRecipe = resolvedRecipeOptions.resolvedSelectedChoice;
    }
  }

  const [recipe, setRecipe] = React.useState(resolvedSelectedRecipe);

  let setButtonEnabled = false;

  if (props.type === 'building') {
    if (building && (recipe || recipeChoices.length === 0)) {
      setButtonEnabled = true;
    }
  }

  const setSelectedDataButton = () => {
    pixiJsStore.update((s) => {
      const instance = s[pixiCanvasStateId];

      instance.selectedMachine = building;
      instance.selectedRecipe = recipe;
    });
    setOpenDialog(false);
    closeDrawerFunction(false);
  };

  const [openDialogFlash] = React.useState(() => {
    if (building && recipeChoices.length === 0 && machineChoices.length === 1) {
      setTimeout(setSelectedDataButton, 0);
      return false;
    } else {
      return openDialog;
    }
  });

  return (
    <Dialog
      open={openDialogFlash}
      fullScreen={isMobile}
      onClose={() => {
        setOpenDialog(false);
      }}
    >
      <DialogTitle>{props.label} Settings</DialogTitle>
      <DialogContent className={classes.openDialog}>
        <ModalOpenTrigger />
        <BrowserView>
          <MachineTypeSelector
            building={building}
            setBuilding={setBuilding}
            choices={machineChoices}
          />
          <RecipeSelector
            disabled={!building}
            recipe={recipe}
            setRecipe={setRecipe}
            choices={recipeChoices}
          />
        </BrowserView>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button
          disabled={!setButtonEnabled}
          color="primary"
          onClick={setSelectedDataButton}
        >
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DrawerDialog;
