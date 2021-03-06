// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { loadSharedTextures } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/loadSharedTextures';

const initPixiJSCanvas = (pixiJS: PIXI.Application, theme: any) => {
  if (!pixiJS?.renderer) {
    return;
  }

  console.time('loadSharedTextures');
  loadSharedTextures(pixiJS.renderer, theme);
  console.timeEnd('loadSharedTextures');
};

export default initPixiJSCanvas;
