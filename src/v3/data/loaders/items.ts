import lazyFunc from 'v3/utils/lazyFunc';
import ConnectionsJson from 'data/Connections.json';
import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import imageRepo from 'data/images/__all';
import RecipeJson from 'data/Recipes.json';
import memoize from 'fast-memoize';

export const getItemDefinition = (itemSlug: string) => {
  return (ItemJson as any)[itemSlug];
};

const getItemByTypeFn = (type: string) => {
  return Object.entries(ItemJson)
    .filter(([key, value]) => {
      return value.itemType === type;
    })
    .map(([key]) => key);
};

const getResourcesFn = () => {
  return Object.entries(ItemJson)
    .filter(([key, value]) => {
      return value.itemType === 'UFGResourceDescriptor';
    })
    .map(([key]) => key);
};

const getResourcesByFormFn = (resourceForm: number) => {
  return Object.entries(ItemJson)
    .filter(([key, value]) => {
      return (
        value.itemType === 'UFGResourceDescriptor' &&
        value.form === resourceForm
      );
    })
    .map(([key]) => key);
};

export const getItemByType = memoize(getItemByTypeFn);
export const getResources = memoize(getResourcesFn);
export const getResourcesByForm = memoize(getResourcesByFormFn);
