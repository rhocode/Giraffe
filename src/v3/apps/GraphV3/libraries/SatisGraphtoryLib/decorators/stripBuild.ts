export const shouldStripBuild: Map<string, Map<string, boolean>> = new Map();

function stripBuild(target: any, key: any) {
  const name = target.constructor.name;
  if (!shouldStripBuild.get(name)) {
    shouldStripBuild.set(name, new Map());
  }

  const fetchedMap = shouldStripBuild.get(name);

  if (fetchedMap === undefined) {
    return;
  }

  fetchedMap.set(key, true);
}

export const stripBuildImpl = (data: string) =>
  (/Build_([A-Za-z0-9]+)_C/g.exec(data) ?? ['', data])[1];

export default stripBuild;
