import * as PIXI from 'pixi.js-legacy';
import {
  getBuildingIcon,
  getAllBuildableMachines,
} from 'v3/data/loaders/buildings';
import { getItemIcon, getMachineCraftableItems } from 'v3/data/loaders/items';
import sgDevicePixelRatio from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils';

const WIDTH = 220;
const HEIGHT = 145;
const TOP_HEIGHT = HEIGHT - 35;
const BOX_THICKNESS = 4;
const BOX_RADIUS = 10;
const BOX_LINE_THICKNESS = 3;
export const CIRCLE_RADIUS = 8;
const CIRCLE_THICKNESS = 4;
const ITEM_SIZE = 64;
const MACHINE_SIZE = 256;

const GREY = 0x313234;
const GREEN = 0x15cb07;
const YELLOW = 0xd4ce22;
const ORANGE = 0xffa328;
// const PURPLE = 0x7122d5;

export const loadSharedTextures = (pixiRenderer: PIXI.Renderer) => {
  const gfx = new PIXI.Graphics();

  const x = 0,
    y = 0;

  // backboard
  gfx.lineStyle(BOX_THICKNESS, YELLOW, 1);
  gfx.beginFill(GREY, 1.0);
  gfx.drawRoundedRect(x, y, WIDTH, HEIGHT, BOX_RADIUS);
  gfx.endFill();
  gfx.lineStyle(BOX_LINE_THICKNESS, YELLOW, 1);
  gfx.moveTo(x, y + TOP_HEIGHT);
  gfx.lineTo(x + WIDTH, y + TOP_HEIGHT);

  const bounds = gfx.getBounds();
  const backboard = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    sgDevicePixelRatio,
    bounds
  );
  PIXI.Texture.addToCache(backboard, 'backboard');

  // inCircle
  gfx.clear();
  gfx.beginFill(GREEN, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, GREY, 1);
  gfx.drawCircle(x, y, CIRCLE_RADIUS);
  gfx.endFill();

  const inBounds = gfx.getBounds();
  const inCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    sgDevicePixelRatio,
    inBounds
  );
  PIXI.Texture.addToCache(inCircle, 'inCircle');

  // outCircle
  gfx.clear();
  gfx.beginFill(ORANGE, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, GREY, 1);
  gfx.drawCircle(x, y, CIRCLE_RADIUS);
  gfx.endFill();

  const outBounds = gfx.getBounds();
  const outCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.NEAREST,
    sgDevicePixelRatio,
    outBounds
  );
  PIXI.Texture.addToCache(outCircle, 'outCircle');

  // items and machines
  getMachineCraftableItems().forEach((element) => {
    const itemimg = getItemIcon(element, ITEM_SIZE);
    const itemicon = new PIXI.BaseTexture(itemimg);
    const itemtex = new PIXI.Texture(itemicon);
    PIXI.Texture.addToCache(itemtex, element);
  });

  getAllBuildableMachines().forEach((element) => {
    const machineimg = getBuildingIcon(element, MACHINE_SIZE);
    const machineicon = new PIXI.BaseTexture(machineimg);
    const machinetex = new PIXI.Texture(machineicon);
    PIXI.Texture.addToCache(machinetex, element);
  });
};
