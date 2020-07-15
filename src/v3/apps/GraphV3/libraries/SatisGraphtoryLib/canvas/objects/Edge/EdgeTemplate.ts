import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

export enum EdgeType {
  OUTPUT,
  INPUT,
  ANY,
}

export class EdgeContainer extends PIXI.Container {
  private highLight: any = null;

  setHighLight(highLight: any) {
    this.highLight = highLight;
  }

  getHighLight() {
    return this.highLight;
  }
}

export default abstract class EdgeTemplate {
  abstract edgeId: string;
  abstract container: EdgeContainer;
  abstract graphicsObject: PIXI.Graphics;
  abstract targetNode: NodeTemplate;
  abstract sourceNode: NodeTemplate;
  abstract sourceDot: PIXI.Sprite;
  abstract targetDot: PIXI.Sprite;

  abstract removeInteractionEvents(): void;
  abstract enableHitBox(): void;
  abstract disableHitBox(): void;
  abstract update(): void;
}
