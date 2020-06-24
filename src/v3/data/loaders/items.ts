import ItemJson from 'data/Items.json';
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
    .filter(([_, value]) => {
      return (
        value.itemType === 'UFGResourceDescriptor' &&
        value.form === resourceForm
      );
    })
    .map(([key]) => key);
};

// const getItemsFn = () => {
//   return Object.keys(ItemJson);
// };
//
// const getItemMapFn = () => {
//   return ItemJson;
// };

const getItemListFn = () => {
  return Object.entries(ItemJson).map(([slug, value]) => {
    return {
      ...value,
      slug,
    };
  });
};

export const getItemByType = memoize(getItemByTypeFn);
export const getResources = memoize(getResourcesFn);
export const getResourcesByForm = memoize(getResourcesByFormFn);
export const getItemList = memoize(getItemListFn);
