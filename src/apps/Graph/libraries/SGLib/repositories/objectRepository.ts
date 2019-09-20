import dataRepository, { latestProtobufRoot } from './dataRepository';
import { imageRepository } from './imageRepository';

const loadEnumImpl = () => {
  const memoized: Map<String, any> = new Map();

  return (listName: string, listItemName: string) => {
    if (memoized.has(listItemName)) {
      return memoized.get(listItemName);
    } else {
      const loadedPromise = dataRepository(listName, (itemData: any) => {
        const itemList = latestProtobufRoot().lookupEnum(listItemName);
        const itemMap: Map<number, any> = new Map();
        itemData.forEach((item: any) => {
          itemMap.set(item.id, item);
          item.id = itemList.valuesById[item.id];
        });
        return itemMap;
      });

      memoized.set(listItemName, loadedPromise);

      return loadedPromise;
    }
  };
};

const loadEnum = loadEnumImpl();

export const preloadAllEnums = () => {
  return Promise.all([loadEnum('ItemList', 'Item')]);
};

const setEnums = (callback: any) => {
  Promise.all([loadEnum('ItemList', 'Item')]).then(promiseData => {
    const [ItemEnum] = promiseData;

    //TODO: Fix external loads
    const { items } = imageRepository;

    if (callback) {
      callback({
        itemEnums: ItemEnum,
        itemImages: items
      });
    }
  });
};

export default setEnums;
