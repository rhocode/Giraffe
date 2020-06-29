import React from 'react';
import { getRecipeProducts } from 'v3/data/loaders/recipes';
import Avatar from '@material-ui/core/Avatar';
import { getItemIcon } from 'v3/data/loaders/items';

function ItemIcon(props) {
  const { recipe, slug } = props;

  if (recipe) {
    return (
      <React.Fragment>
        {getRecipeProducts(slug)
          .slice(0, 1)
          .map(({ slug: recipeSlug }) => {
            return (
              <Avatar
                key={recipe + recipeSlug}
                variant="rounded"
                alt={recipeSlug}
                src={getItemIcon(recipeSlug)}
              />
            );
          })}
      </React.Fragment>
    );
  }
  return <Avatar variant="rounded" alt={slug} src={getItemIcon(slug)} />;
}

export default ItemIcon;
