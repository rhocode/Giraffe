import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import ItemIcon from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ItemIcon';
import ChipLabel from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ChipLabel';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import { LocaleContext } from 'v3/components/LocaleProvider';
import CustomListSubheader from 'v3/apps/GraphV3/components/ChainWizard/CustomListSubheader';

const deleteFunction = (constraintName) => () => {
  graphWizardStore.update((s) => {
    delete s.constraints[constraintName];
  });
};

const getConstraints = (iterable, translate) => {
  return iterable.map(([key]) => {
    const isRecipe = key.startsWith('recipe-');
    const chipValue = `${
      isRecipe ? translate('typeRecipe') : translate('typeItem')
    }: ${translate(key)}`;

    return (
      <ListItem key={`constraint-${key}`}>
        <Chip
          icon={<ItemIcon recipe={isRecipe} slug={key} />}
          label={<ChipLabel name={chipValue} />}
          onDelete={deleteFunction(key)}
          color="primary"
          variant="outlined"
          deleteIcon={<CloseIcon />}
        />
      </ListItem>
    );
  });
};

function UsedConstraints() {
  const { translate } = React.useContext(LocaleContext);

  const constraints = graphWizardStore.useState((s) => s.constraints);

  const recipeConstraints = Object.entries(constraints).filter(([key]) =>
    key.startsWith('recipe-')
  );

  const itemConstraints = Object.entries(constraints).filter(([key]) =>
    key.startsWith('item-')
  );

  return (
    <React.Fragment>
      {recipeConstraints.length ? (
        <React.Fragment>
          <CustomListSubheader disableSticky>
            Desired Recipe Constraints
          </CustomListSubheader>
          {getConstraints(recipeConstraints, translate)}
        </React.Fragment>
      ) : null}
      {itemConstraints.length ? (
        <React.Fragment>
          <CustomListSubheader disableSticky>
            Desired Item Constraints
          </CustomListSubheader>
          {getConstraints(itemConstraints, translate)}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}

export default UsedConstraints;
