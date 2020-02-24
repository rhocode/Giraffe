export const shouldStripClassName: Map<
  string,
  Map<string, boolean>
> = new Map();

function stripClassName(target: any, key: any) {
  const name = target.constructor.name;
  if (!shouldStripClassName.get(name)) {
    shouldStripClassName.set(name, new Map());
  }

  const fetchedMap = shouldStripClassName.get(name);

  if (fetchedMap === undefined) {
    return;
  }

  fetchedMap.set(key, true);
}

export const stripClassNameImpl = (data: string) =>
  (/[A-Za-z]+_([A-Za-z0-9_]+)_C/g.exec(data) ?? ['', data])[1];

export default stripClassName;
