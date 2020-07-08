import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const TestRect = () =>
  new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 100, 100);
