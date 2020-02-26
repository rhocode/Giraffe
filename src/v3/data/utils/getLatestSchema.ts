import schemas from '../../../generated';

import versionCompare from './versionCompare';

const versions = Object.keys(schemas);
versions.sort(versionCompare);

const getLatestSchema = () => {
  const latestVersion = versions[versions.length - 1];

  return (schemas as any)[latestVersion];
};

export const getAllVersions = () => {
  return versions;
};

export const getLatestVersion = () => {
  return versions[versions.length - 1];
};

export const getNextSchemaName = () => {
  const latestVersion = versions[versions.length - 1];
  const schemaSplit = latestVersion.split('.');
  schemaSplit[schemaSplit.length - 2] = (
    parseInt(schemaSplit[schemaSplit.length - 2]) + 1
  ).toString();
  return schemaSplit.join('.');
};

export default getLatestSchema;
