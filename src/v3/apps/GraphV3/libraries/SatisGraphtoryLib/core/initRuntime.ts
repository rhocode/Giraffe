// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { addChild } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { TestRect } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/TestRect';
import { Node } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/Node';

const initRuntime = () => {
  const testRectangle = TestRect();
  const testNode = Node(100, 100, 'item-electromagnetic-control-rod', '30/30 (100.0%)', '30/30 (100.0%)', 'Mk 1', 100.0, 'building-assembler-mk1', 2, 4);
  // addChild(testRectangle);
  for(var i = 0; i < 100; i++) {
    const tNode = Node(100+i*3, 100+i*3, 'item-aluminum-plate', '30/30 (100.0%)', '30/30 (100.0%)', 'Mk 1', 0.0+i*2, 'building-assembler-mk1', 2, 4);
    addChild(tNode);
  }
  addChild(testNode);
};

export default initRuntime;
