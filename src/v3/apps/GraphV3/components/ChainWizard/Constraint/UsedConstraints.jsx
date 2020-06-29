import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import ItemIcon from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ItemIcon';
import ChipLabel from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ChipLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import { LocaleContext } from 'v3/components/LocaleProvider';

const deleteFunction = (constraintName) => () => {
  graphWizardStore.update((s) => {
    delete s.constraints[constraintName];
  });
};

function UsedConstraints() {
  const { translate } = React.useContext(LocaleContext);

  const constraints = graphWizardStore.useState((s) => s.constraints);
  return Object.entries(constraints).map(([key]) => {
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
          deleteIcon={<DeleteIcon />}
        />
      </ListItem>
    );
  });
}

export default UsedConstraints;
