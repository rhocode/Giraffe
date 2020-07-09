import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const createBackboard = (x: number, y: number) => {
  const backboardTex: PIXI.Texture = PIXI.utils.TextureCache['backboard'];
  const backboard = new PIXI.Sprite(backboardTex);
  backboard.setTransform(x, y);

  backboard.anchor.set(0, 0);
};
