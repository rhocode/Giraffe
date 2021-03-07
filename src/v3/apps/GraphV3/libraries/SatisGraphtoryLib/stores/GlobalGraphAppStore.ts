import { Store } from 'pullstate';
import PIXI from '../canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';
import MouseState from '../canvas/enums/MouseState';
import { GraphObject } from '../canvas/objects/interfaces/GraphObject';
import ExternalInteractionManager from '../canvas/objects/interfaces/ExternalInteractionManager';
import EventEmitter from 'eventemitter3';
import uuidGen from 'v3/utils/stringUtils';
import { sgDevicePixelRatio } from '../canvas/utils/canvasUtils';
import { loadSharedTextures } from '../canvas/utils/loadSharedTextures';
import populateCanvasChildren from '../canvas/populateCanvasChildren';
import {
  addGraphChildrenFromWithinStateUpdate,
  removeAllGraphChildrenFromWithinStateUpdate,
} from '../core/api/canvas/childrenApi';

export const initialGraphAppStateId = uuidGen();

const generateNewCanvasStore = (theme: any, id: string) => {
  return {
    application: (null as unknown) as PIXI.Application,
    pixiViewport: (null as unknown) as Viewport,
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
    lastSelectedSave: {
      name: 'My Awesome Design',
      description: 'Lizard Doggo Approved',
    },
    lastUsedSave: {},
  };
};

export const GlobalGraphAppStore = new Store({
  [initialGraphAppStateId]: generateNewCanvasStore(
    null,
    initialGraphAppStateId
  ),
});

export const populateCanvasStore = (
  pixiCanvasStateId: string,
  theme: any,
  height: number,
  width: number,
  canvasRef: any,
  initialCanvasGraph: any,
  translate: (str: string) => string,
  onFinishLoad: any
) => {
  GlobalGraphAppStore.update((globalGraphState) => {
    let s = globalGraphState[pixiCanvasStateId];
    if (!s) {
      throw new Error(
        'Cannot populate store that does not exist: ' + pixiCanvasStateId
      );
    }

    s.externalInteractionManager.setTheme(theme);

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

    s.pixiViewport = viewport;

    viewport.drag().pinch().wheel({
      smooth: 5,
    });

    s.application = newApplication;

    s.applicationLoaded = true;

    loadSharedTextures(newApplication.renderer, theme);

    const childrenToPush = populateCanvasChildren(
      newApplication,
      viewport,
      translate,
      s.externalInteractionManager as any,
      initialCanvasGraph
    );

    addGraphChildrenFromWithinStateUpdate(
      childrenToPush || [],
      pixiCanvasStateId
    )(globalGraphState);

    newApplication.renderer.render(newApplication.stage);

    s.canvasReady = true;
    // Run the callback
    //TODO: Should it go outside?
    onFinishLoad();
  });
};

export const replaceGraphData = (
  pixiCanvasStateId: string,
  initialCanvasChildren: any,
  translate: any
) => {
  GlobalGraphAppStore.update((globalGraphState: any) => {
    let s = globalGraphState[pixiCanvasStateId];

    const childrenToPush = populateCanvasChildren(
      s.application,
      s.viewport,
      translate,
      s.externalInteractionManager,
      initialCanvasChildren
    );

    removeAllGraphChildrenFromWithinStateUpdate(pixiCanvasStateId)(
      globalGraphState
    );
    addGraphChildrenFromWithinStateUpdate(
      childrenToPush || [],
      pixiCanvasStateId
    )(globalGraphState);
    s.canvasReady = true;
  });
};

export const triggerCanvasUpdateFunction = (canvasId: string) => (t: any) => {
  const s = t[canvasId];
  s.triggerUpdate = s.triggerUpdate + 1;
  // We limit the number of updates to 100
  s.triggerUpdate = s.triggerUpdate % 100;
};
