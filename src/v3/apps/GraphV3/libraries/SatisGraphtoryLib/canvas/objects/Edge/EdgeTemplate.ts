import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export enum EdgeType {
  OUTPUT,
  INPUT,
  ANY,
}

export class EdgeContainer extends PIXI.Container {}

export default interface EdgeTemplate {
  edgeId: string;
  container: EdgeContainer;
  graphic: PIXI.Graphics;

  update(): void;
}
