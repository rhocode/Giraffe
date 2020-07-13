import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

export enum EdgeType {
  OUTPUT,
  INPUT,
  ANY,
}

export class EdgeContainer extends PIXI.Container {}

export default interface EdgeTemplate {
  edgeId: string;
  // container: EdgeContainer;
  graphicsObject: PIXI.Graphics;
  targetNode: NodeTemplate;
  sourceNode: NodeTemplate;
  sourceDot: PIXI.Sprite;
  targetDot: PIXI.Sprite;

  update(): void;
}
