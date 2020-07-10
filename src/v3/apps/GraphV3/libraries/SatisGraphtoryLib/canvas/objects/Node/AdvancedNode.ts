import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { createBackboard } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Backboard';
import { SatisGraphtoryNode } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { getRecipeName } from 'v3/data/loaders/recipes';
import {
  OVERCLOCK_STYLE,
  RECIPE_STYLE,
  TIER_STYLE,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/style/textStyles';
import createTruncatedText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createTruncatedText';
import { getTier } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/tierUtils';
import createText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createText';
import { createDots } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import { createImageIcon } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/ImageIcon';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import {
  RECIPE_OFFSET_X,
  RECIPE_OFFSET_Y,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/consts';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 145;

const TOP_HEIGHT = NODE_HEIGHT - 35;

const TIER_OFFSET_X = 120;
const TIER_OFFSET_Y = 40;
const EFFICIENCY_OFFSET_X = 120;
const EFFICIENCY_OFFSET_Y = 70;
const MACHINE_OFFSET_X = 60;
const MACHINE_OFFSET_Y = 55;
const MACHINE_SIZE = 95;

export default class AdvancedNode implements NodeTemplate {
  container: PIXI.DisplayObject;

  constructor(props: SatisGraphtoryNode) {
    const {
      position,
      recipe,
      tier,
      overclock,
      machineType,
      inputs,
      outputs,
    } = props;

    const x = position.x;
    const y = position.y;

    const container = new PIXI.Container();
    this.container = container;

    container.addChild(createBackboard(x, y));

    const recipeName = getRecipeName(recipe);

    const recipeText = createTruncatedText(
      recipeName,
      NODE_WIDTH,
      RECIPE_STYLE(NODE_WIDTH),
      x + RECIPE_OFFSET_X,
      y + TOP_HEIGHT + RECIPE_OFFSET_Y
    );

    // this.recipeNameText = recipeText;

    container.addChild(recipeText);

    const levelText = createText(
      getTier(tier),
      TIER_STYLE(),
      x + TIER_OFFSET_X,
      y + TIER_OFFSET_Y
    );

    container.addChild(levelText);

    const efficiencyText = createText(
      `${overclock}%`,
      OVERCLOCK_STYLE(),
      x + EFFICIENCY_OFFSET_X,
      y + EFFICIENCY_OFFSET_Y
    );

    container.addChild(efficiencyText);

    // Hold off on inputs and outputs for now
    //
    // const inputStr = new PIXI.Text(input, INPUT_STYLE);
    // inputStr.anchor.set(0, 0.5);
    // inputStr.position.x = x + INPUT_OFFSET_X;
    // inputStr.position.y = y + NODE_HEIGHT + INPUT_OFFSET_Y;
    //
    // const outputStr = new PIXI.Text(output, OUTPUT_STYLE);
    // outputStr.anchor.set(0, 0.5);
    // outputStr.position.x = x + OUTPUT_OFFSET_X;
    // outputStr.position.y = y + NODE_HEIGHT + OUTPUT_OFFSET_Y;

    const inputDotOffsets = inputs.map((entry, i) => {
      return Math.floor(y + ((i + 1) * TOP_HEIGHT) / (inputs.length + 1));
    });

    const outputDotOffsets = outputs.map((entry, i) => {
      return Math.floor(y + ((i + 1) * TOP_HEIGHT) / (outputs.length + 1));
    });

    // Create input dots
    const inputDotTexture = PIXI.utils.TextureCache['inCircle'];

    const inputDots = createDots(inputDotTexture, inputDotOffsets, x);
    for (const dot of inputDots) {
      container.addChild(dot);
    }

    // Create output dots
    const outputDotTexture = PIXI.utils.TextureCache['outCircle'];
    const outputDots = createDots(
      outputDotTexture,
      outputDotOffsets,
      x + NODE_WIDTH
    );
    for (const dot of outputDots) {
      container.addChild(dot);
    }

    const machineTexture = PIXI.utils.TextureCache[machineType];
    const machineImage = createImageIcon(
      machineTexture,
      MACHINE_SIZE,
      MACHINE_SIZE,
      x + MACHINE_OFFSET_X,
      y + MACHINE_OFFSET_Y
    );

    container.addChild(machineImage);

    // Maybe save the items for somewhere else?
    // const itemTex = PIXI.utils.TextureCache[name];
    // const itemSprite = new PIXI.Sprite(itemTex);
    // itemSprite.anchor.set(0.5, 0.5);
    // itemSprite.position.x = x + ITEM_OFFSET_X;
    // itemSprite.position.y = y + TOP_HEIGHT + ITEM_OFFSET_Y;
    // itemSprite.width = ITEM_SIZE;
    // itemSprite.height = ITEM_SIZE;
    this.addInteractionEvents(x, y, NODE_WIDTH, NODE_HEIGHT);
  }

  addInteractionEvents(x: number, y: number, WIDTH: number, HEIGHT: number) {
    const container = this.container;

    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = new PIXI.Rectangle(x, y, WIDTH, HEIGHT);
    let dragging = false;
    let sourceX = 0;
    let sourceY = 0;
    let clickX = 0;
    let clickY = 0;
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
      }
    });
  }
}
