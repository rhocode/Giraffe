import ItemJson from 'data/Items.json';
import memoize from 'fast-memoize';
import imageRepo from 'data/images/__all';
import { getBuildingImageName } from 'v3/data/loaders/buildings';
import { getMachineCraftableRecipeDefinitionList } from 'v3/data/loaders/recipes';

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
    .filter(([, value]) => {
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

export const getItemIcon = (itemSlug: string, size: number = 64) => {
  const imageSlug = `sg${getBuildingImageName(itemSlug)}_${size}`.replace(
    /-/g,
    '_'
  );

  try {
    return (imageRepo as any)[imageSlug];
  } catch (e) {
    throw new Error('No image found: ' + imageSlug);
  }
};

const getMachineCraftableItemsFn = () => {
  return [
    ...new Set(
      getMachineCraftableRecipeDefinitionList()
        .map((item) => {
          return [...item.products.map((subItem: any) => subItem.slug)];
        })
        .flat()
    ),
  ];
};

export const getMachineCraftableItems = memoize(getMachineCraftableItemsFn);
export const getItemByType = memoize(getItemByTypeFn);
export const getResources = memoize(getResourcesFn);
export const getResourcesByForm = memoize(getResourcesByFormFn);
export const getItemList = memoize(getItemListFn);
