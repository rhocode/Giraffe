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

const NODE_WIDTH = 220;
const NODE_HEIGHT = 145;

const TOP_HEIGHT = NODE_HEIGHT - 35;
const RECIPE_OFFSET_X = 35;
const RECIPE_OFFSET_Y = 20;
const TIER_OFFSET_X = 120;
const TIER_OFFSET_Y = 40;
const EFFICIENCY_OFFSET_X = 120;
const EFFICIENCY_OFFSET_Y = 70;
const MACHINE_OFFSET_X = 60;
const MACHINE_OFFSET_Y = 55;
const MACHINE_SIZE = 95;

export default class AdvancedNode implements NodeTemplate {
  // public readonly recipeNameText;

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

    const outputDotOffsets = inputs.map((entry, i) => {
      return Math.floor(y + ((i + 1) * TOP_HEIGHT) / (outputs.length + 1));
    });

    // Create input dots
    const inputDotTexture = PIXI.utils.TextureCache['inCircle'];
    createDots(inputDotTexture, inputDotOffsets, x).map(container.addChild);

    // Create output dots
    const outputDotTexture = PIXI.utils.TextureCache['outCircle'];
    createDots(outputDotTexture, outputDotOffsets, x + NODE_WIDTH).map(
      container.addChild
    );

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

    return container;
  }
}
