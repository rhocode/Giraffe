export const shouldStripDesc: Map<string, Map<string, boolean>> = new Map();

function stripDesc(target: any, key: any) {
  const name = target.constructor.name;
  if (!shouldStripDesc.get(name)) {
    shouldStripDesc.set(name, new Map());
  }

  const fetchedMap = shouldStripDesc.get(name);

  if (fetchedMap === undefined) {
    return;
  }

  fetchedMap.set(key, true);
}

export const stripDescImpl = (data: string) =>
  (/Desc_([A-Za-z0-9]+)_C/g.exec(data) ?? ['', data])[1];

export default stripDesc;
