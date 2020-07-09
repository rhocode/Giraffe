import { Store } from 'pullstate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';

export const generateNewPixiCanvasStore = () => {
  return {
    application: {} as PIXI.Application,
    viewport: {} as Viewport,
    children: new Map<string, PIXI.DisplayObject>(),
    loader: PIXI.Loader,
    canvasReady: false,
    applicationLoaded: false,
  };
};

interface LooseObject {
  [key: string]: any;
}

export const pixiJsStore = new Store({} as LooseObject);
