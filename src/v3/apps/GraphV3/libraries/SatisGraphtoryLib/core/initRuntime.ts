// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { addChild } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { TestRect } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/TestRect';
import { Node } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/Node';
import { TextureLoader } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/TextureLoader';

const initRuntime = (pixiJS: any) => {
  if (!pixiJS.renderer) {
    return;
  }
  const testRectangle = TestRect();

  TextureLoader(pixiJS.renderer)


  const testNode = Node(100, 100, 'item-electromagnetic-control-rod', '30/30 (100.0%)', '30/30 (100.0%)', 'Mk 1', 100.0, 'building-assembler-mk1', 2, 4);
  // addChild(testRectangle);
  for(var i = 0; i < 1000; i++) {
    const tNode = Node(100+i, 100+i, 'item-aluminum-plate', '30/30 (100.0%)', '30/30 (100.0%)', 'Mk 1', 0.0+i*2, 'building-assembler-mk1', 2, 4);
    addChild(tNode);
  }
  addChild(testNode);
};

export default initRuntime;
