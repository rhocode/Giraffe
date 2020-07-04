// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { addChild } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { TestRect } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/TestRect';

const initRuntime = () => {
  const testRectangle = TestRect();
  addChild(testRectangle);
};

export default initRuntime;
