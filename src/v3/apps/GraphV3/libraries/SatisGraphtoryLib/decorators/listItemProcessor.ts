export const shouldPreprocessListItem: Map<
  string,
  Map<string, Function>
> = new Map();

function listItemProcessor(func: Function) {
  return function(target: any, key: any) {
    const name = target.constructor.name;
    if (!shouldPreprocessListItem.get(name)) {
      shouldPreprocessListItem.set(name, new Map());
    }

    const fetchedMap = shouldPreprocessListItem.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, func);
  };
}

export default listItemProcessor;
