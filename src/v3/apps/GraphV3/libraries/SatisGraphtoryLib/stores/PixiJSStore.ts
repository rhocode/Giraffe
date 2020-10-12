import { Store } from 'pullstate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EventEmitter from 'eventemitter3';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';

export const generateNewPixiCanvasStore = (theme: any) => {
  return {
    application: (null as unknown) as PIXI.Application,
    viewport: (null as unknown) as Viewport,
    viewportChildContainer: (null as unknown) as PIXI.Container,
    childrenMap: new Map<string, PIXI.DisplayObject>(),
    children: [] as PIXI.DisplayObject[],
    loader: PIXI.Loader,
    canvasReady: false,
    applicationLoaded: false,
    mouseState: MouseState.MOVE,
    selectedObjects: [] as GraphObject[],
    aliasCanvasObjects: new Set() as Set<any>,
    triggerUpdate: 1,
    selectedMachine: (null as unknown) as string,
    selectedRecipe: (null as unknown) as string,
    selectedEdge: (null as unknown) as string,
    openModals: 0,
    sourceNodeId: '',
    externalInteractionManager: new ExternalInteractionManager(
      new EventEmitter(),
      theme
    ),
  };
};

export const triggerUpdate = (canvasId: string) => {
  pixiJsStore.update((t) => {
    const s = t[canvasId];
    // Toggles it between a 2 and a 1. We need a positive value
    s.triggerUpdate = 3 - s.triggerUpdate;
  });
};

interface LooseObject {
  [key: string]: any;
}

export const pixiJsStore = new Store({} as LooseObject);
