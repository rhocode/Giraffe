import { Store } from 'pullstate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';

export const generateNewPixiCanvasStore = () => {
  return {
    application: (null as unknown) as PIXI.Application,
    viewport: (null as unknown) as Viewport,
    viewportChildContainer: (null as unknown) as PIXI.Container,
    children: new Map<string, PIXI.DisplayObject>(),
    loader: PIXI.Loader,
    canvasReady: false,
    applicationLoaded: false,
    mouseState: MouseState.MOVE,
    selectedNodes: [] as AdvancedNode[],
    aliasCanvasObjects: new Set() as Set<any>,
  };
};

interface LooseObject {
  [key: string]: any;
}

export const pixiJsStore = new Store({} as LooseObject);
