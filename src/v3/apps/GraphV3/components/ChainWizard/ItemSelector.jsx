/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { getItemIcon } from 'v3/data/loaders/items';

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

  return (
    <Autocomplete
      style={{ width: 290 }}
      options={props.suggestions}
      classes={{
        option: classes.option,
        inputRoot: classes.inputRoot,
      }}
      autoHighlight
      disableClearable
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
