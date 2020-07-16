import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';

export enum EdgeType {
  OUTPUT,
  INPUT,
  ANY,
}

export class EdgeContainer extends GraphObjectContainer {
  getBounds(): any {
    return super.getInheritedBounds();
  }
}

export default abstract class EdgeTemplate extends GraphObject {
  id: string;
  abstract graphicsObject: PIXI.Graphics;
  targetNode: NodeTemplate;
  sourceNode: NodeTemplate;
  abstract sourceDot: PIXI.Sprite;
  abstract targetDot: PIXI.Sprite;
  container: EdgeContainer;

  abstract enableHitBox(): void;
  abstract disableHitBox(): void;
  abstract update(): void;

  protected constructor(props: SatisGraphtoryEdgeProps) {
    super();
    const { sourceNode, targetNode, id } = props;

    this.container = new EdgeContainer();
    this.id = id;
    this.container.id = id;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
  }
}
