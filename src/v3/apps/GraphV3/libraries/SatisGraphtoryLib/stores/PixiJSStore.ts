import { Store } from 'pullstate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { Viewport } from 'pixi-viewport';

export const pixiJsStore = new Store({
  application: {} as PIXI.Application,
  viewport: {} as Viewport,
  children: new Map<string, PIXI.DisplayObject>(),
  childQueue: [] as PIXI.DisplayObject[],
  loader: PIXI.Loader,
  loaded: false,
});
