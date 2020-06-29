import React from 'react';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Constraints from 'v3/apps/GraphV3/components/ChainWizard/Constraints';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import CustomListSubheader from 'v3/apps/GraphV3/components/ChainWizard/CustomListSubheader';

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
      <CustomListSubheader disableSticky>
        Resources Required
      </CustomListSubheader>

      <Constraints options={inputs || []} removable={removableInputs || []} />
      <CustomListSubheader disableSticky>
        Resources Produced
      </CustomListSubheader>
      <Constraints options={outputs || []} removable={[]} />
      <CustomListSubheader disableSticky>Recipes Used</CustomListSubheader>
      <Constraints
        options={recipes || []}
        removable={removableRecipes || []}
        recipe
        quantityKey={'multiple'}
      />
      <CustomListSubheader disableSticky>Residuals</CustomListSubheader>
      <Constraints
        options={residuals || []}
        removable={removableResiduals || []}
      />
    </List>
  );
}

export default OutputSubPanel;
