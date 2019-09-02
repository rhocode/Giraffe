import { getNextSchemaName } from '../apps/Graph/libraries/SGLib/utils/getLatestSchema';

const getPackageJsonRaw = () => {
  const packageJson = require('../../package');
  return () => packageJson;
};

const getNextPackageJsonRaw = () => {
  const packageJson = getPackageJson();
  return () => ({ ...packageJson, version: getNextSchemaName() });
};

export const getPackageJson = getPackageJsonRaw();

export const getNextPackageJson = getNextPackageJsonRaw();
