import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

renderInput.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object
};

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      value={suggestion.value}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.number
  ]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired
};

function getSuggestions(suggestions, value, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        return keep;
      });
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  },
  popper: {
    overflowY: 'scroll',
    overflowX: 'hidden',
    maxHeight: 300
  }
}));

export default function IntegrationDownshift(props) {
  const classes = useStyles();

  let popperNode;

  return (
    <Downshift id="downshift-popper" {...props}>
      {({
        clearSelection,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        openMenu,
        selectedItem
      }) => {
        const { onBlur, onFocus, ...inputProps } = getInputProps({
          onChange: event => {
            if (event.target.value === '') {
              clearSelection();
            } else {
              // console.error(event.target.value, props)
              // if (props.onValueChange) {
              //   console.error(event.target.value)
              //   props.onValueChange(event.target.value);
              // }
            }
          },
          onFocus: openMenu
        });

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: { onBlur, onFocus },
              InputLabelProps: getLabelProps({ shrink: true }),
              inputProps,
              ref: node => {
                popperNode = node;
              }
            })}

            <Popper open={isOpen} anchorEl={popperNode}>
              <div
                {...(isOpen
                  ? getMenuProps({}, { suppressRefError: true })
                  : {})}
              >
                <Paper
                  square
                  style={{ marginTop: 8 }}
                  className={classes.popper}
                >
                  {getSuggestions(props.suggestions, inputValue, {
                    showEmpty: true
                  }).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem
                    })
                  )}
                </Paper>
              </div>
            </Popper>
          </div>
        );
      }}
    </Downshift>
  );
}

// USAGE:
//   <AutoComplete
//     initialSelectedItem={usedValue}
//     onValueChange={props.onValueChange} suggestions={
//     Object.keys(lookup).map(key => {
//       return {label: lookup[key], value: key}
//     })} onChange={(selectedItem) => {
//     props.onValueChange(selectedItem);
//   }}
//   />
