import { Store } from 'pullstate';
import * as PIXI from 'pixi.js-legacy';

export const pixiJsStore = new Store({
  application: {} as PIXI.Application,
  children: new Map<string, PIXI.DisplayObject>(),
  childQueue: [] as PIXI.DisplayObject[],
  loader: PIXI.Loader,
  loaded: false,
});
