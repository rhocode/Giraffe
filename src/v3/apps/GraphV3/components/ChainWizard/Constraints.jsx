import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getMachinesFromMachineCraftableRecipe } from 'v3/data/loaders/recipes';
import {
  createItemLimitConstraint,
  createRecipeLimitConstraint,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/solver';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import ItemIcon from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ItemIcon';
import ChipLabel from 'v3/apps/GraphV3/components/ChainWizard/Constraint/ChipLabel';

const optionSortFunc = (removableSet) => ({ slug: aSlug }, { slug: bSlug }) => {
  const aIsRemovable = removableSet.has(aSlug);
  const bIsRemovable = removableSet.has(aSlug);

  if (aIsRemovable && bIsRemovable) {
    return 0;
  }

  if (aIsRemovable) return 1;
  if (bIsRemovable) return -1;

  return aSlug.localeCompare(bSlug);
};

const getDeleteFunction = (show, recipe, name) => {
  if (!show) {
    return null;
  }

  if (recipe) {
    return () =>
      graphWizardStore.update((s) => {
        s.constraints[name] = createRecipeLimitConstraint(name);
      });
  }

  return () =>
    graphWizardStore.update((s) => {
      s.constraints[name] = createItemLimitConstraint(name);
    });
};

function getAmountUnit(recipe, option, translate) {
  return recipe
    ? `x ${translate(getMachinesFromMachineCraftableRecipe(option.slug)[0])}`
    : '/ min';
}

function Constraints(props) {
  const { options, removable, quantityKey, recipe } = props;

  const removableSet = new Set(removable);
  const sortedOptions = [...options].sort(optionSortFunc(removableSet));

  const { translate } = React.useContext(LocaleContext);
  const amount = quantityKey ? quantityKey : 'perMinute';

  return (
    <React.Fragment>
      {sortedOptions.map((option) => {
        return (
          <ListItem key={option.slug}>
            <Chip
              icon={<ItemIcon recipe={recipe} slug={option.slug} />}
              label={
                <ChipLabel
                  amountUnit={getAmountUnit(recipe, option, translate)}
                  name={translate(option.slug)}
                  amount={option[amount] || 0}
                />
              }
              // onDelete={handleDelete}
              color="primary"
              variant="outlined"
              onDelete={getDeleteFunction(
                removableSet.has(option.slug),
                recipe,
                option.slug
              )}
              deleteIcon={<CloseIcon />}
            />
          </ListItem>
        );
      })}
    </React.Fragment>
  );
}

export default Constraints;
