import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const createBadge = (x: number, y: number, color = 'blue') => {
  let badgeTex: PIXI.Texture = PIXI.utils.TextureCache['badge'];
  if (color === 'white') {
    badgeTex = PIXI.utils.TextureCache['badge_white'];
  }
  const badge = new PIXI.Sprite(badgeTex);
  badge.setTransform(x, y);
  badge.anchor.set(0, 0);

  return badge;
};
