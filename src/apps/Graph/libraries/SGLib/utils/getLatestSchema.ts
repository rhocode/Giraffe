import schemas from '../../../../../generated';

import versionCompare from './versionCompare';
const getLatestSchema = () => {
  const versions = Object.keys(schemas);
  versions.sort(versionCompare);
  const latestVersion = versions[versions.length - 1];

  return (schemas as any)[latestVersion];
};

export default getLatestSchema;
