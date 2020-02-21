export const shouldPreprocess: Map<string, Map<string, Function>> = new Map();

function preprocessor(func: Function) {
  return function(target: any, key: any) {
    const name = target.constructor.name;
    if (!shouldPreprocess.get(name)) {
      shouldPreprocess.set(name, new Map());
    }

    const fetchedMap = shouldPreprocess.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, func);
  };
}

export default preprocessor;
