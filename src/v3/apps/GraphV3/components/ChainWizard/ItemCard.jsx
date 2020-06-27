import React from 'react';
import { LocaleContext } from 'v3/components/LocaleProvider';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { getItemIcon } from 'v3/data/loaders/items';
import QualitySelector from 'v3/apps/GraphV3/components/ChainWizard/QuantitySelector';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ItemSelector from 'v3/apps/GraphV3/components/ChainWizard/ItemSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 7,
    paddingBottom: 5,
    paddingTop: 5,
    borderColor: theme.palette.divider,
    borderWidth: 1,
    borderStyle: 'solid',
  },
}));

const gridStyles = makeStyles(() => ({
  root: {
    paddingBottom: 5,
  },
}));

const itemIcon = (slug) => {
  if (slug) {
    return <img alt={slug} height={37} width={37} src={getItemIcon(slug)} />;
  }

  return <div style={{ height: 37, width: 37 }}></div>;
};

function ItemCard(props) {
  const classes = useStyles();
  const gridClasses = gridStyles();

  const { translate } = React.useContext(LocaleContext);

  const [amount, setAmount] = React.useState(1);

  const setAmountWithDeletionTrigger = (amount) => {
    setAmount(amount);
  };

  const { slug, choices } = props;

  return (
    <Paper classes={classes} elevation={3}>
      <Grid
        classes={gridClasses}
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <ItemSelector suggestions={choices} />
        </Grid>
        <Grid item>{translate('per_minute')}</Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>{itemIcon(slug)}</Grid>
        <Grid item>
          <QualitySelector
            amount={amount}
            setAmount={setAmountWithDeletionTrigger}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Primary
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ItemCard;
