import { Store } from 'pullstate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EventEmitter from 'eventemitter3';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';
import { sgDevicePixelRatio } from '../canvas/utils/canvasUtils';
import { loadSharedTextures } from '../canvas/utils/loadSharedTextures';
import {
  addObjectChildrenWithinState,
  removeChildrenFunction,
} from '../core/api/canvas/childrenApi';
import initCanvasChildren from '../canvas/initCanvasChildren';

export const generateNewPixiCanvasStore = (theme: any, id: string) => {
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
      theme,
      id
    ),
    snapToGrid: false,
    autoShuffleEdge: false,
    signedIn: false,
    lastUsedSave: {
      name: 'My Awesome Design',
      description: 'Lizard Doggo Approved',
    },
  };
};

export const triggerCanvasUpdate = (canvasId: string) => {
  pixiJsStore.update(triggerCanvasUpdateFunction(canvasId));
};

export const triggerCanvasUpdateFunction = (canvasId: string) => (t: any) => {
  const s = t[canvasId];
  s.triggerUpdate = s.triggerUpdate + 1;
  // We limit the number of updates to 100
  s.triggerUpdate = s.triggerUpdate % 100;
};

export const replaceGraphData = (
  pixiCanvasStateId: string,
  initialCanvasChildren: any,
  translate: any
) => {
  pixiJsStore.update((sParent) => {
    let s = sParent[pixiCanvasStateId];

    const childrenToPush = initCanvasChildren(
      s.application,
      s.viewport,
      translate,
      s.externalInteractionManager,
      initialCanvasChildren
    );

    removeChildrenFunction(pixiCanvasStateId)(sParent);
    addObjectChildrenWithinState(
      childrenToPush || [],
      pixiCanvasStateId
    )(sParent);
    s.canvasReady = true;
  });
};

export const generateNewCanvas = (
  pixiCanvasStateId: string,
  theme: any,
  height: number,
  width: number,
  canvasRef: any,
  initialCanvasGraph: any,
  translate: (str: string) => string,
  onFinishLoad: any
) => {
  pixiJsStore.update((sParent) => {
    let s = sParent[pixiCanvasStateId];
    if (!s) {
      sParent[pixiCanvasStateId] = generateNewPixiCanvasStore(
        theme,
        pixiCanvasStateId
      );
      s = sParent[pixiCanvasStateId];
    }

    let newApplication = new PIXI.Application({
      transparent: true,
      autoDensity: true,
      height,
      width,
      view: canvasRef.current,
      resolution: sgDevicePixelRatio,
      antialias: true,
    });

    const viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: 20000,
      worldHeight: 20000,
      interaction: newApplication.renderer.plugins.interaction,
    });

    newApplication.stage.addChild(viewport);

    if (s.application?.destroy) {
      s.application.destroy();
    }

    const container = new PIXI.Container();
    s.viewportChildContainer = container;
    viewport.addChild(container);

    s.viewport = viewport;

    viewport.drag().pinch().wheel({
      smooth: 5,
    });

    s.application = newApplication;

    s.applicationLoaded = true;

    loadSharedTextures(newApplication.renderer, theme);

    const childrenToPush = initCanvasChildren(
      newApplication,
      s.viewport,
      translate,
      s.externalInteractionManager,
      initialCanvasGraph
    );

    addObjectChildrenWithinState(
      childrenToPush || [],
      pixiCanvasStateId
    )(sParent);
    newApplication.renderer.render(newApplication.stage);
    // Run the callback
    onFinishLoad();

    s.canvasReady = true;
  });
};

interface LooseObject {
  [key: string]: any;
}

export const pixiJsStore = new Store({} as LooseObject);
