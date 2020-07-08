import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { getItemDefinition } from 'v3/data/loaders/items';

const WIDTH = 220;
const HEIGHT = 145;
const TOP_HEIGHT = HEIGHT - 35;
const NAME_OFFSET_X = 35;
const NAME_OFFSET_Y = 20;
const LEVEL_OFFSET_X = 120;
const LEVEL_OFFSET_Y = 40;
const EFFICIENCY_OFFSET_X = 120;
const EFFICIENCY_OFFSET_Y = 70;
const INPUT_OFFSET_X = 10;
const INPUT_OFFSET_Y = 15;
const OUTPUT_OFFSET_X = INPUT_OFFSET_X;
const OUTPUT_OFFSET_Y = 35;
const MACHINE_OFFSET_X = 60;
const MACHINE_OFFSET_Y = 55;
const MACHINE_SIZE = 95;
const ITEM_OFFSET_X = 20;
const ITEM_OFFSET_Y = 20;
const ITEM_SIZE = 20;
const NAME_FONT_SIZE = 22;
const NAME_FONT_OFFSET = 40;
const LEVEL_FONT_SIZE = 28;
const EFFICIENCY_FONT_SIZE = 28;
const INPUT_FONT_SIZE = 20;
const OUTPUT_FONT_SIZE = 20;

const GREEN = 0x15cb07;
const ORANGE = 0xffa328;
const WHITE = 0xffffff;

const NAME_STYLE = new PIXI.TextStyle({
  align: 'left',
  fill: WHITE,
  fontSize: NAME_FONT_SIZE,
  fontFamily: '"Bebas Neue", sans-serif',
  breakWords: true,
  wordWrapWidth: WIDTH - NAME_FONT_OFFSET,
  wordWrap: true,
});

const LEVEL_STYLE = new PIXI.TextStyle({
  align: 'left',
  fill: WHITE,
  fontSize: LEVEL_FONT_SIZE,
  fontFamily: '"Roboto Condensed", sans-serif',
});

const EFFICIENCY_STYLE = new PIXI.TextStyle({
  align: 'left',
  fill: GREEN,
  fontSize: EFFICIENCY_FONT_SIZE,
  fontFamily: '"Roboto Condensed", sans-serif',
});

const INPUT_STYLE = new PIXI.TextStyle({
  align: 'left',
  fill: GREEN,
  fontSize: INPUT_FONT_SIZE,
  fontFamily: '"Roboto Condensed", sans-serif',
});

const OUTPUT_STYLE = new PIXI.TextStyle({
  align: 'left',
  fill: ORANGE,
  fontSize: OUTPUT_FONT_SIZE,
  fontFamily: '"Roboto Condensed", Helvetica, sans-serif',
});

export const Node = (
  x: number,
  y: number,
  name: string,
  input: string,
  output: string,
  level: string,
  efficiency: number,
  machine: string,
  nIn: number,
  nOut: number
) => {
  const container = new PIXI.Container();

  const backboardTex = PIXI.utils.TextureCache['backboard'];
  const backboard = new PIXI.Sprite(backboardTex);
  backboard.anchor.set(0, 0);
  backboard.position.x = x;
  backboard.position.y = y;

  // backboard.on('pointerdown', () => {console.log('clicked')})
  // backboard.on('pointerover', () => {console.log('hover')})

  container.addChild(backboard);

  const baseName = getItemDefinition(name).name;
  const baseMetrics = PIXI.TextMetrics.measureText(baseName, NAME_STYLE);
  let adjName = '';

  if (baseMetrics.lineWidths[0] < WIDTH - NAME_FONT_OFFSET) {
    adjName = baseMetrics.lines[0];
    if (baseMetrics.lineWidths.length > 1) {
      adjName += '...';
    }
  } else {
    const newMet = PIXI.TextMetrics.measureText(
      baseMetrics.lines[0] + '...',
      NAME_STYLE
    );
    adjName = newMet.lines[0] + '...';
  }

  const nameStr = new PIXI.Text(adjName, NAME_STYLE);
  nameStr.anchor.set(0, 0.5);
  nameStr.position.x = x + NAME_OFFSET_X;
  nameStr.position.y = y + TOP_HEIGHT + NAME_OFFSET_Y;

  const levelStr = new PIXI.Text(level, LEVEL_STYLE);
  levelStr.anchor.set(0, 0.5);
  levelStr.position.x = x + LEVEL_OFFSET_X;
  levelStr.position.y = y + LEVEL_OFFSET_Y;

  const efficiencyStr = new PIXI.Text(
    efficiency.toString() + '%',
    EFFICIENCY_STYLE
  );
  efficiencyStr.anchor.set(0, 0.5);
  efficiencyStr.position.x = x + EFFICIENCY_OFFSET_X;
  efficiencyStr.position.y = y + EFFICIENCY_OFFSET_Y;

  const inputStr = new PIXI.Text(input, INPUT_STYLE);
  inputStr.anchor.set(0, 0.5);
  inputStr.position.x = x + INPUT_OFFSET_X;
  inputStr.position.y = y + HEIGHT + INPUT_OFFSET_Y;

  const outputStr = new PIXI.Text(output, OUTPUT_STYLE);
  outputStr.anchor.set(0, 0.5);
  outputStr.position.x = x + OUTPUT_OFFSET_X;
  outputStr.position.y = y + HEIGHT + OUTPUT_OFFSET_Y;

  const inOffsets = [];
  for (let i = 0; i < nIn; i++) {
    inOffsets[i] = Math.floor(y + ((i + 1) * TOP_HEIGHT) / (nIn + 1));
  }

  const outOffsets = [];
  for (let i = 0; i < nOut; i++) {
    outOffsets[i] = Math.floor(y + ((i + 1) * TOP_HEIGHT) / (nOut + 1));
  }

  const inTex = PIXI.utils.TextureCache['inCircle'];
  inOffsets.forEach(function (offset) {
    const inCircle = new PIXI.Sprite(inTex);
    inCircle.anchor.set(0.4, 0.5);
    inCircle.position.x = x;
    inCircle.position.y = offset;
    container.addChild(inCircle);
  });

  const outTex = PIXI.utils.TextureCache['outCircle'];
  outOffsets.forEach(function (offset) {
    const outCircle = new PIXI.Sprite(outTex);
    outCircle.anchor.set(0.4, 0.5);
    outCircle.position.x = x + WIDTH;
    outCircle.position.y = offset;
    container.addChild(outCircle);
  });

  const machineTex = PIXI.utils.TextureCache[machine];
  const machineSprite = new PIXI.Sprite(machineTex);
  machineSprite.anchor.set(0.5, 0.5);
  machineSprite.position.x = x + MACHINE_OFFSET_X;
  machineSprite.position.y = y + MACHINE_OFFSET_Y;
  machineSprite.width = MACHINE_SIZE;
  machineSprite.height = MACHINE_SIZE;

  const itemTex = PIXI.utils.TextureCache[name];
  const itemSprite = new PIXI.Sprite(itemTex);
  itemSprite.anchor.set(0.5, 0.5);
  itemSprite.position.x = x + ITEM_OFFSET_X;
  itemSprite.position.y = y + TOP_HEIGHT + ITEM_OFFSET_Y;
  itemSprite.width = ITEM_SIZE;
  itemSprite.height = ITEM_SIZE;

  container.addChild(nameStr);
  container.addChild(levelStr);
  container.addChild(efficiencyStr);
  container.addChild(inputStr);
  container.addChild(outputStr);
  container.addChild(machineSprite);
  container.addChild(itemSprite);

  container.interactive = true;
  container.buttonMode = true;
  container.hitArea = new PIXI.Rectangle(x, y, WIDTH, HEIGHT);
  let dragging = false;
  let sourceX = 0;
  let sourceY = 0;
  let clickX = 0;
  let clickY = 0;
  container.on('pointerover', onHover);
  container.on('pointerdown', function (this: any, event: any) {
    event.stopPropagation();
    const newPos = event.data.getLocalPosition(this.parent);
    clickX = newPos.x;
    clickY = newPos.y;
    sourceX = this.position.x;
    sourceY = this.position.y;
    dragging = true;
  });
  container.on('pointerup', () => {
    dragging = false;
  });
  container.on('pointerupoutside', () => {
    dragging = false;
  });
  container.on('pointermove', function (this: any, event: any) {
    if (dragging) {
      event.stopPropagation();
      const newPos = event.data.getLocalPosition(this.parent);
      container.position.x = sourceX + (newPos.x - clickX);
      container.position.y = sourceY + (newPos.y - clickY);
      // console.log(
      //   container.position.x,
      //   container.position.y
      // );
    }
  });

  // container.cacheAsBitmap = true

  return container;
};

function onHover() {
  // console.log('hover')
}
