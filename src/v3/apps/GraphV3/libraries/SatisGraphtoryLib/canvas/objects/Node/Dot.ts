import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { NodeContainer } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

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

export function addDotsToNode(
  dotOffsets: number[],
  x: number,
  container: NodeContainer,
  texture: string
) {
  // Create output dots
  const dotTexture = PIXI.utils.TextureCache[texture];
  const dots = createDots(dotTexture, dotOffsets, x);

  for (const dot of dots) {
    container.addChild(dot);
  }
}

export function calculateConnectionNodeOffset(slots: any[], length: number) {
  return slots.map((entry, i) => {
    return Math.floor(((i + 1) * length) / (slots.length + 1));
  });
}
