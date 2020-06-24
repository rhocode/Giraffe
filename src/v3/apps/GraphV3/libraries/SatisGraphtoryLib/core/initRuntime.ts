// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { kiwiSolver } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/solver';

const initRuntime = () => {
  // graphAppStore.update(s => {
  //   s.placeableMachineClasses = getBuildableMachineClassNames();
  // });
  //
  kiwiSolver();
};

export default initRuntime;
