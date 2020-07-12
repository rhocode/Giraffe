import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { createBackboard } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Backboard';
import { SatisGraphtoryNodeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import {
  MACHINE_STYLE,
  OVERCLOCK_STYLE,
  RECIPE_STYLE,
  TIER_STYLE,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/style/textStyles';
import createTruncatedText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createTruncatedText';
import { getTier } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/tierUtils';
import createText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createText';
// import { createDots } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import { createImageIcon } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/ImageIcon';
import {
  NodeContainer,
  NodeTemplate,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { createHighlight } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Highlight';

import { getClassNameFromBuildableMachines } from 'v3/data/loaders/buildings';
// import { createBadge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Badge';
import {
  EFFICIENCY_OFFSET_X,
  EFFICIENCY_OFFSET_Y,
  HIGHLIGHT_OFFSET_X,
  HIGHLIGHT_OFFSET_Y,
  MACHINE_NAME_OFFSET_X,
  MACHINE_NAME_OFFSET_Y,
  MACHINE_OFFSET_X,
  MACHINE_OFFSET_Y,
  RECIPE_OFFSET_X,
  RECIPE_OFFSET_Y,
  TIER_OFFSET_X,
  TIER_OFFSET_Y,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Offsets';
import {
  MACHINE_SIZE,
  NODE_HEIGHT,
  NODE_WIDTH,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import EdgeTemplate, {
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

export default class AdvancedNode implements NodeTemplate {
  container: NodeContainer;
  nodeId: string;
  inEdges: (EdgeTemplate | null)[];
  outEdges: (EdgeTemplate | null)[];
  edgeMap = new Map<string, number>();
  edges: EdgeTemplate[];

  private readonly x: number;
  private readonly y: number;

  constructor(props: SatisGraphtoryNodeProps) {
    const {
      nodeId,
      position,
      recipeLabel,
      tier,
      overclock,
      machineName,
      machineLabel,
      inputs,
      outputs,
    } = props;

    const x = position.x;
    this.x = x;
    const y = position.y;
    this.y = y;

    const container = new NodeContainer();
    container.nodeId = nodeId;
    this.nodeId = nodeId;
    this.container = container;

    const highlight = createHighlight(
      x + HIGHLIGHT_OFFSET_X,
      y + HIGHLIGHT_OFFSET_Y
    );
    highlight.visible = false;
    container.highLight = highlight;

    container.addChild(highlight);

    const machineType = getClassNameFromBuildableMachines(machineName)!;

    container.boundCalculator = createBackboard(x, y, machineType);

    container.addChild(container.boundCalculator);

    const recipeText = createTruncatedText(
      recipeLabel,
      NODE_WIDTH,
      RECIPE_STYLE(NODE_WIDTH),
      x + RECIPE_OFFSET_X,
      y + RECIPE_OFFSET_Y,
      'center'
    );

    const machineText = createText(
      machineLabel,
      MACHINE_STYLE(),
      x + MACHINE_NAME_OFFSET_X,
      y + MACHINE_NAME_OFFSET_Y,
      'center'
    );

    container.addChild(machineText);

    // this.recipeNameText = recipeText;

    container.addChild(recipeText);

    const machineTexture = PIXI.utils.TextureCache[machineName];
    const machineImage = createImageIcon(
      machineTexture,
      MACHINE_SIZE,
      MACHINE_SIZE,
      x + MACHINE_OFFSET_X,
      y + MACHINE_OFFSET_Y
    );

    container.addChild(machineImage);

    // container.addChild(createBadge(x + TIER_BADGE_OFFSET_X, y + TIER_BADGE_OFFSET_Y, 'white'))

    const levelText = createText(
      getTier(tier),
      TIER_STYLE(),
      x + TIER_OFFSET_X,
      y + TIER_OFFSET_Y
    );

    container.addChild(levelText);

    // container.addChild(createBadge(x + BADGE_OFFSET_X, y + BADGE_OFFSET_Y));

    const efficiencyText = createText(
      `${overclock}%`,
      OVERCLOCK_STYLE(),
      x + EFFICIENCY_OFFSET_X,
      y + EFFICIENCY_OFFSET_Y,
      'right'
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
      return Math.floor(y + ((i + 1) * NODE_HEIGHT) / (inputs.length + 1));
    });

    const outputDotOffsets = outputs.map((entry, i) => {
      return Math.floor(y + ((i + 1) * NODE_HEIGHT) / (outputs.length + 1));
    });

    // // Create input dots
    // const inputDotTexture = PIXI.utils.TextureCache['inCircle'];
    //
    // const inputDots = createDots(inputDotTexture, inputDotOffsets, x);
    // for (const dot of inputDots) {
    //   container.addChild(dot);
    // }

    this.container.inputMapping = inputDotOffsets;
    this.container.inputX = x;

    this.container.outputMapping = outputDotOffsets;
    this.container.outputX = x + NODE_WIDTH;

    this.inEdges = [];
    this.outEdges = [];
    this.edges = [];

    for (let i = 0; i < inputs.length; i++) {
      this.inEdges.push(null);
    }

    for (let i = 0; i < outputs.length; i++) {
      this.outEdges.push(null);
    }

    //
    // // Create output dots
    // const outputDotTexture = PIXI.utils.TextureCache['outCircle'];
    // const outputDots = createDots(
    //   outputDotTexture,
    //   outputDotOffsets,
    //   x + NODE_WIDTH
    // );
    // for (const dot of outputDots) {
    //   container.addChild(dot);
    // }

    // Maybe save the items for somewhere else?
    // const itemTex = PIXI.utils.TextureCache[name];
    // const itemSprite = new PIXI.Sprite(itemTex);
    // itemSprite.anchor.set(0.5, 0.5);
    // itemSprite.position.x = x + ITEM_OFFSET_X;
    // itemSprite.position.y = y + NODE_HEIGHT + ITEM_OFFSET_Y;
    // itemSprite.width = ITEM_SIZE;
    // itemSprite.height = ITEM_SIZE;
  }

  updateEdges = () => {
    this.edges.map((edge) => edge.update());
  };

  addEdge(edge: EdgeTemplate, edgeType: EdgeType) {
    this.edges.push(edge);
    if (edgeType === EdgeType.INPUT) {
      const firstNull = this.inEdges.indexOf(null);

      this.inEdges[firstNull] = edge;
      this.edgeMap.set(edge.edgeId, firstNull);
    } else if (edgeType === EdgeType.OUTPUT) {
      const firstNull = this.outEdges.indexOf(null);

      this.outEdges[firstNull] = edge;
      this.edgeMap.set(edge.edgeId, firstNull);
    } else {
      console.log('Unimplemented!');
    }
  }

  removeInteractionEvents() {
    const container = this.container;

    container.interactive = false;
    container.buttonMode = false;
    container.off('click');
    container.off('pointerdown');
    container.off('pointerup');
    container.off('pointerupoutside');
    container.off('pointermove');
  }

  addSelectEvents(onSelectNodes: (nodeIds: string[]) => any) {
    const x = this.x;
    const y = this.y;

    const container = this.container;

    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = new PIXI.Rectangle(x, y, NODE_WIDTH, NODE_HEIGHT);

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
    });

    container.on('click', function (this: any, event: any) {
      event.stopPropagation();
      onSelectNodes([container.nodeId]);
    });
  }

  tempOm: any = null;
  tempIm: any = null;
  tempOx: number = 0;
  tempIx: number = 0;

  snapshotEdgePositions = () => {
    this.tempOm = [...this.container.outputMapping];
    this.tempIm = [...this.container.inputMapping];
    this.tempOx = this.container.outputX;
    this.tempIx = this.container.inputX;
  };

  updateContainerPositions = (dx: number, dy: number) => {
    this.container.outputMapping = this.container.outputMapping.map(
      (item, index) => {
        if (item === null) return null;
        return this.tempOm[index] + dy;
      }
    );

    this.container.inputMapping = this.container.inputMapping.map(
      (item, index) => {
        if (item === null) return null;
        return this.tempIm[index] + dy;
      }
    );

    this.container.outputX = this.tempOx + dx;
    this.container.inputX = this.tempIx + dx;
  };

  addDragEvents() {
    const x = this.x;
    const y = this.y;

    const container = this.container;

    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = new PIXI.Rectangle(x, y, NODE_WIDTH, NODE_HEIGHT);

    let dragging = false;
    let sourceX = 0;
    let sourceY = 0;
    let clickX = 0;
    let clickY = 0;

    const snapshotEdgePositions = this.snapshotEdgePositions;

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
      const newPos = event.data.getLocalPosition(this.parent);
      clickX = newPos.x;
      clickY = newPos.y;
      sourceX = this.position.x;
      sourceY = this.position.y;
      dragging = true;
      snapshotEdgePositions();
    });

    container.on('pointerup', function (this: any, event: any) {
      // event.stopPropagation();
      dragging = false;
    });

    container.on('pointerupoutside', () => {
      dragging = false;
    });

    const updateEdges = this.updateEdges;
    const updateContainerPositions = this.updateContainerPositions;

    container.on('pointermove', function (this: any, event: any) {
      if (dragging) {
        event.stopPropagation();
        const newPos = event.data.getLocalPosition(this.parent);
        const deltaX = newPos.x - clickX;
        const deltaY = newPos.y - clickY;

        container.position.x = sourceX + deltaX;
        container.position.y = sourceY + deltaY;
        updateContainerPositions(deltaX, deltaY);
        updateEdges();
      }
    });
  }
}
