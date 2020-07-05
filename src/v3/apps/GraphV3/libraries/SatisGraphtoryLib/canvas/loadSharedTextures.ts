import * as PIXI from 'pixi.js';
import { getBuildingIcon } from 'v3/data/loaders/buildings';
import { getItemIcon } from 'v3/data/loaders/items';

const WIDTH = 220;
const HEIGHT = 145;
const TOP_HEIGHT = HEIGHT - 35;
const GREY = 0x313234;
const GREEN = 0x15cb07;
const YELLOW = 0xd4ce22;
const ORANGE = 0xffa328;
const DARK_GREY = 0x232422;
const PURPLE = 0x7122d5;

export const loadSharedTextures = (pixiRenderer: PIXI.Renderer) => {
  const gfx = new PIXI.Graphics();

  const x = 0,
    y = 0;

  gfx.lineStyle(4, YELLOW, 1);
  gfx.beginFill(GREY, 1.0);
  gfx.drawRoundedRect(x, y, WIDTH, HEIGHT, 10);
  gfx.endFill();
  gfx.lineStyle(3, YELLOW, 1);
  gfx.moveTo(x, y + 110);
  gfx.lineTo(x + WIDTH, y + 110);

  const bounds = gfx.getBounds();
  const backboard = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    devicePixelRatio,
    bounds
  );
  PIXI.Texture.addToCache(backboard, 'backboard');

  gfx.clear();
  gfx.beginFill(GREEN, 1);
  gfx.lineStyle(4, GREY, 1);
  gfx.drawCircle(x, y, 8);
  gfx.endFill();

  const inBounds = gfx.getBounds();
  const inCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    devicePixelRatio,
    inBounds
  );
  PIXI.Texture.addToCache(inCircle, 'inCircle');

  gfx.clear();
  gfx.beginFill(ORANGE, 1);
  gfx.lineStyle(4, GREY, 1);
  gfx.drawCircle(x, y, 8);
  gfx.endFill();
  // gfx.setTransform(undefined, undefined, 5, 5)

  const outBounds = gfx.getBounds();
  const outCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    devicePixelRatio,
    outBounds
  );
  PIXI.Texture.addToCache(outCircle, 'outCircle');

  //SAMPLE CHANGE LATER
  const itemimg = getItemIcon('item-electromagnetic-control-rod', 64);
  const itemicon = new PIXI.BaseTexture(itemimg);
  const itemtex = new PIXI.Texture(itemicon);
  PIXI.Texture.addToCache(itemtex, 'item-electromagnetic-control-rod');

  const machineimg = getBuildingIcon('building-assembler-mk1', 256);
  const machineicon = new PIXI.BaseTexture(machineimg);
  const machinetex = new PIXI.Texture(machineicon);
  PIXI.Texture.addToCache(machinetex, 'building-assembler-mk1');
};
