import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export const createNodeHighlight = (x: number, y: number) => {
  const highlightTex: PIXI.Texture = PIXI.utils.TextureCache['highlight'];
  const highlight = new PIXI.Sprite(highlightTex);
  highlight.setTransform(x, y);
  highlight.anchor.set(0, 0);
  highlight.visible = false;

  return highlight;
};
