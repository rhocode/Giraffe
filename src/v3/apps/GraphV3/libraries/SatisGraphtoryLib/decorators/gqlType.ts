export type stringOrFunction = string | Function;

export const resolveStringOrFunction = (a: stringOrFunction): string => {
  if (typeof a === 'string') {
    return a;
  }

  return a();
};

export const allGqlTypes: Map<string, Map<string, string>> = new Map();

function gqlType(type: string) {
  return function(target: any, key: any) {
    let name = target.constructor.name;

    if (name === 'EnumWrapper') {
      name = Object.getPrototypeOf(target).constructor.name;
    }

    if (!allGqlTypes.get(name)) {
      allGqlTypes.set(name, new Map());
    }

    const fetchedMap = allGqlTypes.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, type);
  };
}

export default gqlType;
