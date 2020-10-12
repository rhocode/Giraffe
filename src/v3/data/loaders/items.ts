import ItemJson from 'data/Items.json';
import memoize from 'fast-memoize';
import { getBuildingImageName } from 'v3/data/loaders/buildings';
import { getMachineCraftableRecipeDefinitionList } from 'v3/data/loaders/recipes';
import produce from 'immer';
import SGImageRepo from 'v3/data/loaders/sgImageRepo';

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

// const imageMap = new Map<string, any>();
//
// const preloadAllIcons = () => {
//   Object.entries(imageRepo).forEach(([name, src]) => {
//     const img = document.createElement('img');
//     img.src = src; // Assigning the img src immediately requests the image.
//     imageMap.set(name, img);
//   });
// };
//
// // Preload all icons here
// preloadAllIcons();

export const getItemIcon = (itemSlug: string, size: number = 256) => {
  const itemImageSlug = `${getBuildingImageName(itemSlug)}.${256}.png`;

  const image = SGImageRepo.get(itemImageSlug);

  if (!image) {
    throw new Error('No image found: ' + itemImageSlug);
  }
  return image;
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

const getAllItemsFn = () => {
  return produce(ItemJson, (draftState) => {
    Object.entries(ItemJson).forEach(([slug, item]) => {
      (draftState as any)[slug] = item;
    });
  });
};

export const getItemResourceForm = (itemSlug: string) => {
  return (getAllItemsFn() as Record<string, any>)[itemSlug].form;
};

export const getItemName = (itemSlug: string) => {
  return (getAllItemsFn() as Record<string, any>)[itemSlug].name;
};

export const getAllItems = memoize(getAllItemsFn);
export const getMachineCraftableItems = memoize(getMachineCraftableItemsFn);
export const getItemByType = memoize(getItemByTypeFn);
export const getResources = memoize(getResourcesFn);
export const getResourcesByForm = memoize(getResourcesByFormFn);
export const getItemList = memoize(getItemListFn);
