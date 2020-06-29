import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import Constraints from 'v3/apps/GraphV3/components/ChainWizard/Constraints';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function OutputSubPanel() {
  const classes = useStyles();
  const {
    inputs,
    outputs,
    removableRecipes,
    removableResiduals,
    removableInputs,
    residuals,
    recipes,
  } = graphWizardStore.useState((s) => s.result);

  return (
    <List className={classes.root}>
      <ListSubheader disableSticky>Resources Required</ListSubheader>

      <Constraints options={inputs || []} removable={removableInputs || []} />
      <ListSubheader disableSticky>Resources Produced</ListSubheader>
      <Constraints options={outputs || []} removable={[]} />
      <ListSubheader disableSticky>Recipes Used</ListSubheader>
      <Constraints
        options={recipes || []}
        removable={removableRecipes || []}
        recipe
        quantityKey={'multiple'}
      />
      <ListSubheader disableSticky>Residuals</ListSubheader>
      <Constraints
        options={residuals || []}
        removable={removableResiduals || []}
      />
    </List>
  );
}

export default OutputSubPanel;
