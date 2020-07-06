import * as PIXI from 'pixi.js';
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

const addImageToCacheAndGPU = (
  pixiApplication: PIXI.Application,
  image: string,
  id: string
) => {
  // const icon = new PIXI.BaseTexture(image);
  // const texture = new PIXI.Texture(icon);
  // Turns out we only need to add it to the resource loader
  pixiApplication.loader.add(id, image);
  // This is if we want to add it to the GPU preparer
  // pixiRenderer.plugins.prepare.add(texture);

  // PIXI.Texture.addToCache(texture, id);
};

const addTextureToCacheAndGPU = (
  pixiApplication: PIXI.Application,
  texture: PIXI.Texture,
  id: string
) => {
  // This is if we use the GPU
  // pixiRenderer.plugins.prepare.add(texture);
  PIXI.Texture.addToCache(texture, id);
};

export const loadSharedTextures = (pixi: PIXI.Application) => {
  const pixiRenderer = pixi.renderer;

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

  addTextureToCacheAndGPU(pixi, backboard, 'backboard');

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
  addTextureToCacheAndGPU(pixi, inCircle, 'inCircle');

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
  addTextureToCacheAndGPU(pixi, outCircle, 'outCircle');

  // items and machines
  getMachineCraftableItems().forEach((element) => {
    const itemImg = getItemIcon(element, ITEM_SIZE);
    addImageToCacheAndGPU(pixi, itemImg, element);
  });

  getAllBuildableMachines().forEach((element) => {
    const machineImg = getBuildingIcon(element, MACHINE_SIZE);
    addImageToCacheAndGPU(pixi, machineImg, element);
  });

  return new Promise((resolve) => {
    // This is if we were using the GPU
    // pixiRenderer.plugins.prepare.upload(() => {
    //   resolve();
    // })
    pixi.loader.load(() => {
      resolve();
    });
  });
};
