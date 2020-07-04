import * as PIXI from 'pixi.js';

export const TestRect = () =>
  new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 100, 100);
