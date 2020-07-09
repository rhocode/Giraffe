import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const createDots = (
  texture: PIXI.Texture,
  yOffsets: number[],
  x: number
) => {
  return yOffsets.map((offset) => Dot(texture, x, offset));
};

export const Dot = (texture: PIXI.Texture, x: number, y: number) => {
  const dot = new PIXI.Sprite(texture);
  dot.anchor.set(0.4, 0.5);
  dot.position.x = x;
  dot.position.y = y;
  return dot;
};
