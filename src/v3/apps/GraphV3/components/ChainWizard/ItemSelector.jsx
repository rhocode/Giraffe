/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { getItemIcon } from 'v3/data/loaders/items';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import { useStoreState } from 'pullstate';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  inputRoot: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },
});

export default function ItemSelector(props) {
  const classes = useStyles();

  const { stateId } = props;

  const productHook = useStoreState(graphWizardStore, (s) => {
    return s.products;
  });

  const blacklistedValues = new Set(
    Object.values(productHook)
      .map((item) => item.slug)
      .filter((item) => item)
  );

  const changeInputBox = (evt, value) =>
    graphWizardStore.update((state) => {
      state.products[stateId].slug = value.value;
    });

  // Kill this once done.
  const defaultValue = graphWizardStore.useState(
    (s) => s.products[stateId]?.slug
  );

  const optionsDefaultValue = props.suggestions.filter(
    (item) => item.value === defaultValue
  );

  const calculatedDefaultValue = optionsDefaultValue.length
    ? optionsDefaultValue[0]
    : null;

  const [inputState, setInputState] = React.useState('');

  return (
    <Autocomplete
      style={{ width: 285 }}
      options={props.suggestions}
      classes={{
        option: classes.option,
        inputRoot: classes.inputRoot,
      }}
      onChange={changeInputBox}
      filterOptions={(options) => {
        if (
          inputState.trim() !== '' &&
          inputState !== calculatedDefaultValue.label.toLowerCase()
        ) {
          return options.filter(
            (item) =>
              (!blacklistedValues.has(item.value) ||
                item.value === calculatedDefaultValue.value) &&
              item.label.toLowerCase().indexOf(inputState) !== -1
          );
        }

        return options.filter((item) => !blacklistedValues.has(item.value));
      }}
      autoHighlight
      disableClearable
      onInputChange={(evt, value) => {
        setInputState(value.toLowerCase());
      }}
      value={calculatedDefaultValue}
      getOptionLabel={(option) => option.label}
      renderOption={(option) => (
        <React.Fragment>
          <img
            style={{ height: 20, width: 20, paddingRight: 10 }}
            alt={option.value}
            src={getItemIcon(option.value)}
          />
          {option.label}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  );
}
