import schemas from '../../../generated';

import versionCompare from './versionCompare';

const getLatestSchema = () => {
  const versions = Object.keys(schemas);
  versions.sort(versionCompare);
  const latestVersion = versions[versions.length - 1];

  return (schemas as any)[latestVersion];
};

export const getLatestSchemaName = () => {
  const versions = Object.keys(schemas);
  versions.sort(versionCompare);
  return versions[versions.length - 1];
};

export const getNextSchemaName = () => {
  const versions = Object.keys(schemas);
  versions.sort(versionCompare);
  const latestVersion = versions[versions.length - 1];
  const schemaSplit = latestVersion.split('.');
  schemaSplit[schemaSplit.length - 2] = (
    parseInt(schemaSplit[schemaSplit.length - 2]) + 1
  ).toString();
  return schemaSplit.join('.');
};

export default getLatestSchema;
