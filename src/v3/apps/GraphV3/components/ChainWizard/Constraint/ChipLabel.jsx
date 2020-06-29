import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  chip: {
    color: theme.palette.text.primary,
  },
}));
function ChipLabel(props) {
  const { name, amount, amountUnit } = props;
  const classes = useStyles();
  if (amount === null || amount === undefined) {
    return <div className={classes.chip}>{`${name}`}</div>;
  }

  return (
    <React.Fragment>
      <div className={classes.chip}>{`${name}`}</div>
      <div className={classes.chip}>{`${amount.toFixed(2)} ${amountUnit}`}</div>
    </React.Fragment>
  );
}

export default ChipLabel;
