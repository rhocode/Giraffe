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
import { getTierText } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/tierUtils';
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
  calculateConnectionNodeOffset,
  Dot,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import EventEmitter from 'eventemitter3';
import { Events } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Events';
import initializeMap from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/initializeMap';
import EdgeTemplate, {
  EdgeAttachmentSide,
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';

export default class AdvancedNode extends NodeTemplate {
  connectionsMap: Map<EdgeAttachmentSide, EdgeTemplate[]> = new Map();
  connectionsDirectionMap: Map<EdgeTemplate, EdgeType> = new Map();
  connectionsContainer: PIXI.Container = new PIXI.Container();

  constructor(props: SatisGraphtoryNodeProps) {
    super(props);

    const { recipeLabel, tier, overclock, machineName, machineLabel } = props;

    const container = this.container;

    container.setHighLightObject(
      createNodeHighlight(HIGHLIGHT_OFFSET_X, HIGHLIGHT_OFFSET_Y)
    );
    this.container.addChild(this.container.getHighLight());
    this.container.setHighLightOn(false);

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
      getTierText(tier),
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

    this.recalculateConnections();

    container.addChild(this.connectionsContainer);
  }

  eventFunctions = new Map<string, any[]>();

  recalculateConnections() {
    this.connectionsMap.clear();
    this.connectionsOffsetMap.clear();
    this.connectionsContainer.removeChildren();

    for (const anyEdge of this.anyConnections) {
      let side;
      if (anyEdge.sourceNode === this) {
        side = anyEdge.sourceNodeAttachmentSide;
      } else if (anyEdge.targetNode === this) {
        side = anyEdge.targetNodeAttachmentSide;
      } else {
        // It's an empty node, do something!!!
        side = anyEdge.sourceNodeAttachmentSide;
      }
      let connectionsArray: EdgeTemplate[] = [];
      if (this.connectionsMap.get(side)) {
        connectionsArray = this.connectionsMap.get(side)!;
      }
      connectionsArray.push(anyEdge);
      this.connectionsMap.set(side, connectionsArray);
      this.connectionsDirectionMap.set(anyEdge, EdgeType.ANY);
    }

    for (const inputEdge of this.inputConnections) {
      const side = inputEdge.targetNodeAttachmentSide;
      let connectionsArray: EdgeTemplate[] = [];
      if (this.connectionsMap.get(side)) {
        connectionsArray = this.connectionsMap.get(side)!;
      }
      connectionsArray.push(inputEdge);
      this.connectionsMap.set(side, connectionsArray);
      this.connectionsDirectionMap.set(inputEdge, EdgeType.INPUT);
    }

    for (const outputEdge of this.outputConnections) {
      const side = outputEdge.sourceNodeAttachmentSide;
      let connectionsArray: EdgeTemplate[] = [];
      if (this.connectionsMap.get(side)) {
        connectionsArray = this.connectionsMap.get(side)!;
      }
      connectionsArray.push(outputEdge);
      this.connectionsMap.set(side, connectionsArray);
      this.connectionsDirectionMap.set(outputEdge, EdgeType.OUTPUT);
    }

    for (const [side, edges] of this.connectionsMap.entries()) {
      switch (side) {
        case EdgeAttachmentSide.TOP:
        case EdgeAttachmentSide.BOTTOM:
          let y = side === EdgeAttachmentSide.TOP ? 0 : NODE_HEIGHT;
          const yFunc1 = () => y;
          const xFunc1 = (offset: number[], i: number) => offset[i];
          this.recalculateEdgesForSide(side, edges, NODE_WIDTH, xFunc1, yFunc1);
          break;
        case EdgeAttachmentSide.LEFT:
        case EdgeAttachmentSide.RIGHT:
          let x = side === EdgeAttachmentSide.LEFT ? 0 : NODE_WIDTH;
          const xFunc2 = () => x;
          const yFunc2 = (offset: number[], i: number) => offset[i];
          this.recalculateEdgesForSide(
            side,
            edges,
            NODE_HEIGHT,
            xFunc2,
            yFunc2
          );
          break;
        default:
          throw new Error('Unknown side ' + side);
      }
    }
  }

  private recalculateEdgesForSide(
    side: EdgeAttachmentSide,
    edges: EdgeTemplate[],
    length: number,
    xFunc: Function,
    yFunc: Function
  ) {
    const offsets = calculateConnectionNodeOffset(edges, length);
    this.connectionsOffsetMap.set(side, offsets);

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      this.connectionsIndexMap.set(edge, i);
      this.connectionsSideMap.set(edge, side);

      const direction = this.connectionsDirectionMap.get(edge)!;

      let dotTexture;
      if (direction === EdgeType.INPUT) {
        dotTexture = PIXI.utils.TextureCache['inCircle'];
      } else if (direction === EdgeType.OUTPUT) {
        dotTexture = PIXI.utils.TextureCache['outCircle'];
      } else if (direction === EdgeType.ANY) {
        //TODO: FIX
        dotTexture = PIXI.utils.TextureCache['inCircle'];
      }

      const dot = Dot(dotTexture, xFunc(offsets, i), yFunc(offsets, i));
      this.connectionsContainer.addChild(dot);
    }
  }

  delete() {
    const ret = super.delete();
    this.recalculateConnections();
    return ret;
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

  addSelectEvents(onSelectObjects: (ids: string[]) => any) {
    const container = this.addContainerHitArea();

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
    });

    container.on('click', function (this: any, event: any) {
      event.stopPropagation();
      onSelectObjects([container.id]);
    });
  }

  // TODO: Determine if we should pass through an event emitter in the constructor
  // We might want to lazyily only attach this event emitter if we add events.
  eventEmitter: EventEmitter = (null as unknown) as EventEmitter;

  addEvent(event: string, functionToAdd: any) {
    initializeMap<string, any[]>(this.eventFunctions, event, []);
    this.eventFunctions.get(event)!.push(functionToAdd);

    this.eventEmitter.addListener(event, functionToAdd, this);
  }

  addLinkEvents(startFunc: Function, endFunc: Function, cancelFunc: Function) {
    // Drag Pointer Down Start

    let linkStarted: GraphObject | null = null;

    function linkPointerDownSourceNode(this: any, triggerSource: any) {
      if (linkStarted) {
        if (linkStarted === this && this === triggerSource) {
          cancelFunc();
          linkStarted = null;
          console.log('CANCELED');
        } else {
          if (triggerSource === this) {
            endFunc(this.id);
          }
          // else {
          //   console.log("NOT THE TRIGGERED SOURCE");
          // }
          linkStarted = null;
        }
      } else {
        linkStarted = triggerSource;

        if (triggerSource === this) {
          startFunc(this.id);
        }
      }
    }

    this.addEvent(Events.NodePointerDown, linkPointerDownSourceNode);

    const container = this.addContainerHitArea();

    const context = this;

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
      context.eventEmitter.emit(Events.NodePointerDown, context);
    });
  }

  addDragEvents() {
    const container = this.addContainerHitArea();

    let dragging = false;
    let dragLeader = false;
    let sourceX = 0;
    let sourceY = 0;
    let clickX = 0;
    let clickY = 0;

    const context = this;

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
      }
    }

    this.addEvent(Events.NodePointerDown, dragPointerDownFunction);

    let moveAllHighlighted = false;

    container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
      const newPos = event.data.getLocalPosition(this.parent);
      moveAllHighlighted = this.highLight.visible;
      context.eventEmitter.emit(
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

    this.addEvent(Events.NodePointerUp, dragPointerUpFunction);

    container.on('pointerup', function (this: any) {
      context.eventEmitter.emit(
        Events.NodePointerUp,
        context,
        moveAllHighlighted
      );
    });

    container.on('pointerupoutside', function (this: any) {
      context.eventEmitter.emit(
        Events.NodePointerUp,
        context,
        moveAllHighlighted
      );
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

    this.addEvent(Events.NodePointerMove, dragPointerMoveFunction);

    container.on('pointermove', function (this: any, event: any) {
      if (dragLeader && dragging) {
        event.stopPropagation();
        const newPos = event.data.getLocalPosition(this.parent);
        const deltaX = newPos.x - clickX;
        const deltaY = newPos.y - clickY;
        context.eventEmitter.emit(
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

  private addContainerHitArea() {
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
