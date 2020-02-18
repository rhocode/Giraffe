export type stringOrFunction = string | Function;

export const resolveStringOrFunction = (a: stringOrFunction): string => {
  if (typeof a === 'string') {
    return a;
  }

  return a();
};

export const pbTypeResolver: Map<string, Map<string, Function>> = new Map();

function PbTypeResolver(type: Function) {
  return function(target: any, key: any) {
    const name = target.constructor.name;
    if (!pbTypeResolver.get(name)) {
      pbTypeResolver.set(name, new Map());
    }

    const fetchedMap = pbTypeResolver.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, type);
  };
}

export default PbTypeResolver;
