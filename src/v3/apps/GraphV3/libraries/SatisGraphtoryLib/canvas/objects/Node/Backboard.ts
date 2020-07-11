import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { MACHINE_CLASS_MAP } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';

export const createBackboard = (x: number, y: number, type: string) => {
  const machineClass = MACHINE_CLASS_MAP[type];
  const backboardTex: PIXI.Texture = PIXI.utils.TextureCache[machineClass];
  const backboard = new PIXI.Sprite(backboardTex);
  backboard.setTransform(x, y);
  backboard.anchor.set(0, 0);

  return backboard;
};
