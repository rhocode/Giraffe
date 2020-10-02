import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  getAllBuildableMachines,
  getBuildingIcon,
} from 'v3/data/loaders/buildings';
import { getItemIcon, getMachineCraftableItems } from 'v3/data/loaders/items';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import {
  // BADGE_HEIGHT,
  // BADGE_RADIUS,
  // BADGE_THICKNESS,
  // BADGE_WIDTH,
  BOX_RADIUS,
  BOX_THICKNESS,
  CIRCLE_RADIUS,
  CIRCLE_THICKNESS,
  NODE_HIGHLIGHT_THICKNESS,
  ITEM_SIZE,
  MACHINE_ICON_SIZE,
  NODE_HEIGHT,
  NODE_WIDTH,
  // SMALL_BADGE_WIDTH,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';

function createBackboard(
  gfx: PIXI.Graphics,
  x: number,
  y: number,
  pixiRenderer: PIXI.Renderer,
  outlineColor: any,
  fillColor: any
) {
  gfx.lineStyle(BOX_THICKNESS, outlineColor, 1);
  gfx.beginFill(fillColor, 1.0);
  gfx.drawRoundedRect(x, y, NODE_WIDTH, NODE_HEIGHT, BOX_RADIUS);
  gfx.endFill();

  const bounds = gfx.getBounds();
  const backboard = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    bounds
  );

  return { bounds, backboard };
}

const checkOrReplaceTexture = (texture: any, name: string) => {
  const existing = PIXI.utils.TextureCache[name];

  if (existing) {
    existing.baseTexture = texture.baseTexture;
    existing.update();
  } else {
    PIXI.Texture.addToCache(texture, name);
  }
};

export const loadSharedTextures = (pixiRenderer: PIXI.Renderer, theme: any) => {
  const gfx = new PIXI.Graphics();

  const x = 0,
    y = 0;

  // backboard (machine)
  const { backboard: machineBackboard } = createBackboard(
    gfx,
    x,
    y,
    pixiRenderer,
    theme.nodes.machines.border,
    theme.nodes.machines.backboard
  );

  checkOrReplaceTexture(machineBackboard, 'machine');

  // backboard (infrastructure)
  const { backboard: infrastructureBackboard } = createBackboard(
    gfx,
    x,
    y,
    pixiRenderer,
    theme.nodes.infrastructure.border,
    theme.nodes.infrastructure.backboard
  );

  checkOrReplaceTexture(infrastructureBackboard, 'infra');

  // backboard (storage)
  const { backboard: storageBackboard } = createBackboard(
    gfx,
    x,
    y,
    pixiRenderer,
    theme.nodes.storage.border,
    theme.nodes.storage.backboard
  );

  checkOrReplaceTexture(storageBackboard, 'storage');

  // highlight
  gfx.clear();
  gfx.lineStyle(NODE_HIGHLIGHT_THICKNESS, theme.nodes.highlight, 0.7);
  gfx.drawRoundedRect(x, y, NODE_WIDTH, NODE_HEIGHT, BOX_RADIUS);

  const boundsHighlight = gfx.getBounds();
  const highlight = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    boundsHighlight
  );
  checkOrReplaceTexture(highlight, 'highlight');

  // inRectangle
  gfx.clear();
  gfx.beginFill(theme.connectors.in, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, theme.canvas.background, 1);
  gfx.drawRoundedRect(x, y, 2 * CIRCLE_RADIUS, 2 * CIRCLE_RADIUS, 3);
  gfx.endFill();

  const inRectBounds = gfx.getBounds();
  const inRectangle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    inRectBounds
  );
  checkOrReplaceTexture(inRectangle, 'inRectangle');

  // outRectangle
  gfx.clear();
  gfx.beginFill(theme.connectors.out, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, theme.canvas.background, 1);
  gfx.drawRoundedRect(x, y, 2 * CIRCLE_RADIUS, 2 * CIRCLE_RADIUS, 3);
  gfx.endFill();

  const outRectBounds = gfx.getBounds();
  const outRectangle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    outRectBounds
  );
  checkOrReplaceTexture(outRectangle, 'outRectangle');

  // anyRectangle
  gfx.clear();
  gfx.beginFill(theme.connectors.any, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, theme.canvas.background, 1);
  gfx.drawRoundedRect(x, y, 2 * CIRCLE_RADIUS, 2 * CIRCLE_RADIUS, 3);
  gfx.endFill();

  const anyRectBounds = gfx.getBounds();
  const anyRectangle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    anyRectBounds
  );
  checkOrReplaceTexture(anyRectangle, 'anyRectangle');

  // inCircle
  gfx.clear();
  gfx.beginFill(theme.connectors.in, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, theme.canvas.background, 1);
  gfx.drawCircle(x, y, CIRCLE_RADIUS);
  gfx.endFill();

  const inBounds = gfx.getBounds();
  const inCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    inBounds
  );
  checkOrReplaceTexture(inCircle, 'inCircle');

  // outCircle
  gfx.clear();
  gfx.beginFill(theme.connectors.out, 1);
  gfx.lineStyle(CIRCLE_THICKNESS, theme.canvas.background, 1);
  gfx.drawCircle(x, y, CIRCLE_RADIUS);
  gfx.endFill();

  const outBounds = gfx.getBounds();
  const outCircle = pixiRenderer.generateTexture(
    gfx,
    PIXI.SCALE_MODES.LINEAR,
    sgDevicePixelRatio * 4,
    outBounds
  );
  checkOrReplaceTexture(outCircle, 'outCircle');

  // items and machines
  getMachineCraftableItems().forEach((element) => {
    const itemImg = getItemIcon(element, ITEM_SIZE);
    const itemIcon = new PIXI.BaseTexture(itemImg);
    const itemTex = new PIXI.Texture(itemIcon);
    checkOrReplaceTexture(itemTex, element);
  });

  getAllBuildableMachines().forEach((element) => {
    const machineImg = getBuildingIcon(element, MACHINE_ICON_SIZE);
    const machineIcon = new PIXI.BaseTexture(machineImg);
    const machineTex = new PIXI.Texture(machineIcon);
    checkOrReplaceTexture(machineTex, element);
  });

  // badge (blue)
  // gfx.clear();
  // gfx.lineStyle(BADGE_THICKNESS, BLUE, 1);
  // gfx.beginFill(GREY, 1.0);
  // gfx.drawRoundedRect(x, y, BADGE_WIDTH, BADGE_HEIGHT, BADGE_RADIUS);
  // gfx.endFill();
  // const badge = pixiRenderer.generateTexture(
  //   gfx,
  //   PIXI.SCALE_MODES.LINEAR,
  //   sgDevicePixelRatio * 4,
  //   bounds
  // );
  // checkOrReplaceTexture(badge, 'badge');
  //
  // // badge (white)
  // gfx.clear();
  // gfx.lineStyle(BADGE_THICKNESS, WHITE, 1);
  // gfx.beginFill(GREY, 1.0);
  // gfx.drawRoundedRect(x, y, SMALL_BADGE_WIDTH, BADGE_HEIGHT, BADGE_RADIUS);
  // gfx.endFill();
  // const badge_white = pixiRenderer.generateTexture(
  //   gfx,
  //   PIXI.SCALE_MODES.LINEAR,
  //   sgDevicePixelRatio * 4,
  //   bounds
  // );
  // checkOrReplaceTexture(badge_white, 'badge_white');
};
