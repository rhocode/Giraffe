export const allDataFields: Map<string, Map<string, string>> = new Map();

function dataField(type: string) {
  return function(target: any, key: any) {
    const name = target.constructor.name;
    if (!allDataFields.get(name)) {
      allDataFields.set(name, new Map());
    }

    const fetchedMap = allDataFields.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, type);
  };
}

export default dataField;
