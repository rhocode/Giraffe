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

import { createImageIcon } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/ImageIcon';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { createNodeHighlight } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeHighlight';

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
import {
  addDotsToNode,
  calculateNodeOffset,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import EventEmitter from 'eventemitter3';
import { Events } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Events';
import initializeMap from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/initializeMap';

export default class AdvancedNode extends NodeTemplate {
  inputMapping: any[] = [];
  outputMapping: any[] = [];
  inputX: number = 0;
  outputX: number = 0;

  constructor(props: SatisGraphtoryNodeProps) {
    super(props);

    const {
      recipeLabel,
      tier,
      overclock,
      machineName,
      machineLabel,
      inputs,
      outputs,
    } = props;

    const container = this.container;

    // NEED THIS
    container.highLight = createNodeHighlight(
      HIGHLIGHT_OFFSET_X,
      HIGHLIGHT_OFFSET_Y
    );

    container.addChild(container.highLight);

    const machineType = getClassNameFromBuildableMachines(machineName)!;

    container.boundCalculator = createBackboard(0, 0, machineType);
    container.addChild(container.boundCalculator);

    const recipeText = createTruncatedText(
      recipeLabel,
      NODE_WIDTH,
      RECIPE_STYLE(NODE_WIDTH),
      RECIPE_OFFSET_X,
      RECIPE_OFFSET_Y,
      'center'
    );

    const machineText = createText(
      machineLabel,
      MACHINE_STYLE(),
      MACHINE_NAME_OFFSET_X,
      MACHINE_NAME_OFFSET_Y,
      'center'
    );

    container.addChild(machineText);
    container.addChild(recipeText);

    const machineTexture = PIXI.utils.TextureCache[machineName];
    const machineImage = createImageIcon(
      machineTexture,
      MACHINE_SIZE,
      MACHINE_SIZE,
      MACHINE_OFFSET_X,
      MACHINE_OFFSET_Y
    );

    container.addChild(machineImage);

    const levelText = createText(
      getTier(tier),
      TIER_STYLE(),
      TIER_OFFSET_X,
      TIER_OFFSET_Y
    );

    container.addChild(levelText);

    const efficiencyText = createText(
      `${overclock}%`,
      OVERCLOCK_STYLE(),
      EFFICIENCY_OFFSET_X,
      EFFICIENCY_OFFSET_Y,
      'right'
    );

    container.addChild(efficiencyText);

    const inputDotOffsets = calculateNodeOffset(inputs, 0, NODE_HEIGHT);
    const outputDotOffsets = calculateNodeOffset(outputs, 0, NODE_HEIGHT);

    // Create Input Dots
    addDotsToNode(inputDotOffsets, 0, container, 'inCircle');

    // Create Output Dots
    addDotsToNode(outputDotOffsets, NODE_WIDTH, container, 'outCircle');

    this.inputMapping = inputDotOffsets;
    this.inputX = 0;

    this.outputMapping = outputDotOffsets;
    this.outputX = NODE_WIDTH;
  }

  eventFunctions = new Map<string, any[]>();

  removeInteractionEvents() {
    const container = this.container;

    container.interactive = false;
    container.buttonMode = false;
    container.off('click');
    container.off('pointerdown');
    container.off('pointerup');
    container.off('pointerupoutside');
    container.off('pointermove');

    if (this.eventEmitter) {
      for (const [name, events] of this.eventFunctions.entries()) {
        for (const event of events) {
          this.eventEmitter.removeListener(name, event, this);
        }
      }

      this.eventFunctions = new Map();
      this.eventEmitter = (null as unknown) as EventEmitter;
    }
  }

  addSelectEvents(onSelectNodes: (nodeIds: string[]) => any) {
    const container = this.createNodeContainer();

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
    });

    container.on('click', function (this: any, event: any) {
      event.stopPropagation();
      onSelectNodes([container.nodeId]);
    });
  }

  // TODO: Determine if we should pass through an event emitter in the constructor
  // We might want to lazyily only attach this event emitter if we add events.
  eventEmitter: EventEmitter = (null as unknown) as EventEmitter;

  addEvent(eventEmitter: EventEmitter, event: string, functionToAdd: any) {
    this.eventEmitter = eventEmitter;

    initializeMap<string, any[]>(this.eventFunctions, event, []);
    this.eventFunctions.get(event)!.push(functionToAdd);

    eventEmitter.addListener(event, functionToAdd, this);
  }

  addDragEvents(eventEmitter: EventEmitter) {
    const container = this.createNodeContainer();

    let dragging = false;
    let dragLeader = false;
    let sourceX = 0;
    let sourceY = 0;
    let clickX = 0;
    let clickY = 0;

    const context = this;
    const snapshotEdgePositions = this.snapshotEdgePositions;

    // Drag Functions Start

    // Drag Pointer Down Start
    function dragPointerDownFunction(
      this: any,
      triggerSource: any,
      newPos: PIXI.ObservablePoint,
      moveAllHighlightedArg: boolean
    ) {
      if (
        triggerSource === this ||
        (moveAllHighlightedArg && this.container.highLight.visible)
      ) {
        clickX = newPos.x;
        clickY = newPos.y;
        sourceX = container.position.x;
        sourceY = container.position.y;
        dragging = true;
        snapshotEdgePositions();
      }
    }

    this.addEvent(
      eventEmitter,
      Events.NodePointerDown,
      dragPointerDownFunction
    );

    let moveAllHighlighted = false;

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
      const newPos = event.data.getLocalPosition(this.parent);
      moveAllHighlighted = this.highLight.visible;
      eventEmitter.emit(
        Events.NodePointerDown,
        context,
        newPos,
        moveAllHighlighted
      );
      dragLeader = true;
    });

    // Drag Pointer Up Start
    function dragPointerUpFunction(
      this: any,
      triggerSource: any,
      moveAllHighlightedArg: boolean
    ) {
      if (triggerSource === this || moveAllHighlightedArg) {
        dragging = false;
        dragLeader = false;
        updateEdges();
      }
    }

    this.addEvent(eventEmitter, Events.NodePointerUp, dragPointerUpFunction);

    container.on('pointerup', function (this: any) {
      eventEmitter.emit(Events.NodePointerUp, context, moveAllHighlighted);
    });

    container.on('pointerupoutside', function (this: any) {
      eventEmitter.emit(Events.NodePointerUp, context, moveAllHighlighted);
    });

    // Drag Pointer Move Start
    const updateEdges = this.updateEdges;

    function dragPointerMoveFunction(
      this: any,
      triggerSource: any,
      deltaX: number,
      deltaY: number,
      moveAllHighlightedArg: boolean
    ) {
      if (dragging && (triggerSource === this || moveAllHighlightedArg)) {
        container.position.x = sourceX + deltaX;
        container.position.y = sourceY + deltaY;
        updateEdges();
      }
    }

    this.addEvent(
      eventEmitter,
      Events.NodePointerMove,
      dragPointerMoveFunction
    );

    container.on('pointermove', function (this: any, event: any) {
      if (dragLeader && dragging) {
        event.stopPropagation();
        const newPos = event.data.getLocalPosition(this.parent);
        const deltaX = newPos.x - clickX;
        const deltaY = newPos.y - clickY;
        eventEmitter.emit(
          Events.NodePointerMove,
          context,
          deltaX,
          deltaY,
          moveAllHighlighted
        );
      }
    });

    return [];
  }

  private createNodeContainer() {
    const container = this.container;

    container.interactive = true;
    container.buttonMode = true;
    if (container.hitArea?.destroy) {
      container.hitArea.destroy();
    }
    container.hitArea = new PIXI.Rectangle(0, 0, NODE_WIDTH, NODE_HEIGHT);

    return container;
  }
}
