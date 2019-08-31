import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(suggestions, value) {
  const inputValue = deburr(value.trim()).toLowerCase();

  return suggestions.filter(suggestion => {
    return suggestion.label.toLowerCase().indexOf(inputValue) !== -1;
  });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  divider: {
    height: theme.spacing(2)
  },
  paperList: {
    maxHeight: 600,
    overflowY: 'auto'
  }
}));

export default function IntegrationAutosuggest(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    single: '',
    popper: props.initialValue || ''
  });

  const [stateSuggestions, setSuggestions] = React.useState(props.suggestions);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(props.suggestions, value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions(props.suggestions);
  };

  const handleChange = name => (event, { newValue }) => {
    if (props.postChangeEvent) {
      const translate =
        props.translate ||
        function(a) {
          return a;
        };
      props.postChangeEvent(translate(newValue));
    }

    setState({
      ...state,
      [name]: newValue
    });
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <Autosuggest
      {...autosuggestProps}
      inputProps={{
        classes,
        value: state.popper,
        onChange: handleChange('popper'),
        inputRef: node => {
          setAnchorEl(node);
        },
        disabled: props.disabled,
        InputLabelProps: {
          shrink: true
        }
      }}
      theme={{
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      shouldRenderSuggestions={() => true}
      renderSuggestionsContainer={options => (
        <Popper
          className={classes.popper}
          modifiers={
            {
              // preventOverflow: {
              //   enabled: true,
              //   boundariesElement: 'window',
              // }
            }
          }
          anchorEl={anchorEl}
          open={Boolean(options.children)}
        >
          <Paper
            square
            {...options.containerProps}
            className={classes.paperList}
          >
            {options.children}
          </Paper>
        </Popper>
      )}
    />
  );
}
