import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const createImageIcon = (
  texture: PIXI.Texture,
  width: number,
  height: number,
  x: number,
  y: number
) => {
  const imageSprite = new PIXI.Sprite(texture);
  imageSprite.anchor.set(0.5, 0.5);
  imageSprite.position.x = x;
  imageSprite.position.y = y;
  imageSprite.width = width;
  imageSprite.height = height;

  return imageSprite;
};
