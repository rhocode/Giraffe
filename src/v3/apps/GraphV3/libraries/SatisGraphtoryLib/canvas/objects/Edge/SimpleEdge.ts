import EdgeTemplate, {
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  LINE_HIGHLIGHT_THICKNESS,
  LINE_THICKNESS,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import {
  DARK_ORANGE,
  ORANGE,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import { Dot } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import Bezier from 'bezier-js';

export default class SimpleEdge extends EdgeTemplate {
  graphicsObject: PIXI.Graphics;
  sourceDot: PIXI.Sprite;
  targetDot: PIXI.Sprite;

  private selected: boolean = false;
  private hitBoxEnabled = false;

  constructor(props: SatisGraphtoryEdgeProps) {
    super(props);

    this.container.setHighLightObject(new PIXI.Graphics());
    this.container.addChild(this.container.getHighLight());
    this.container.setHighLightOn(false);

    this.graphicsObject = new PIXI.Graphics();
    this.container.addChild(this.graphicsObject);

    const inputDotTexture = PIXI.utils.TextureCache['outCircle'];
    const inputDot = Dot(inputDotTexture, 0, 0);

    const outDotTexture = PIXI.utils.TextureCache['inCircle'];
    const outputDot = Dot(outDotTexture, 0, 0);

    this.sourceDot = inputDot;
    this.targetDot = outputDot;

    this.container.addChild(inputDot);
    this.container.addChild(outputDot);

    this.sourceNode.addEdge(this, EdgeType.OUTPUT);
    this.targetNode.addEdge(this, EdgeType.INPUT);

    this.updateWithoutHitBox();
  }

  addSelectEvents(onSelectObjects: (ids: string[]) => any): void {}

  removeInteractionEvents(): void {
    this.disableHitBox();
  }

  enableHitBox(): void {
    this.hitBoxEnabled = true;
    this.update();
  }

  disableHitBox(): void {
    this.hitBoxEnabled = false;
    this.update();
  }

  updateWithoutHitBox = () => {
    const { x: sourceX, y: sourceY } = this.sourceNode.getConnectionCoordinate(
      this.id,
      EdgeType.OUTPUT
    );
    const { x: targetX, y: targetY } = this.targetNode.getConnectionCoordinate(
      this.id,
      EdgeType.INPUT
    );

    this.sourceDot.position.x = sourceX;
    this.sourceDot.position.y = sourceY;
    this.targetDot.position.x = targetX;
    this.targetDot.position.y = targetY;

    this.graphicsObject.clear();
    this.container.getHighLight().clear();
    this.graphicsObject.lineStyle(LINE_THICKNESS, ORANGE, 1);
    this.graphicsObject.moveTo(sourceX, sourceY);

    const dX = Math.abs(targetX - sourceX) * (3 / 4);
    const dY = 0; //Math.abs(targetY - sourceY) * 0;

    this.graphicsObject.bezierCurveTo(
      sourceX + dX,
      sourceY + dY,
      targetX - dX,
      targetY - dY,
      targetX,
      targetY
    );

    const highLight = this.container.getHighLight();
    highLight.moveTo(sourceX, sourceY);
    highLight.lineStyle(LINE_HIGHLIGHT_THICKNESS, DARK_ORANGE, 1);
    highLight.bezierCurveTo(
      sourceX + dX,
      sourceY + dY,
      targetX - dX,
      targetY - dY,
      targetX,
      targetY
    );

    return {
      sourceX,
      sourceY,
      dX,
      dY,
      targetX,
      targetY,
    };
  };

  isSelected = () => {
    return this.selected;
  };

  setSelectedState = (selected: boolean) => {
    if (selected !== this.selected) {
      this.selected = selected;
      this.updateWithoutHitBox();
    }
  };

  // Simple alias for updateWithHitbox
  update = () => {
    this.updateWithHitBox();
  };

  updateWithHitBox = () => {
    const {
      sourceX,
      sourceY,
      dX,
      dY,
      targetX,
      targetY,
    } = this.updateWithoutHitBox();

    if (!this.hitBoxEnabled) {
      this.container.hitArea = null;
      this.container.interactive = false;
      this.container.buttonMode = false;
      return;
    }

    const curve = new Bezier(
      sourceX,
      sourceY,
      sourceX + dX,
      sourceY + dY,
      targetX - dX,
      targetY - dY,
      targetX,
      targetY
    );
    const numPoints = 100;

    const topPointsArray = [];

    const bottomPointsArray = [];

    for (let i = 0; i <= 1; i += 1 / numPoints) {
      topPointsArray.push(curve.offset(i, -10));
      bottomPointsArray.push(curve.offset(i, 10));
    }

    topPointsArray.push({ x: targetX, y: targetY });

    const allPoints = [
      ...topPointsArray,
      ...bottomPointsArray.reverse(),
    ] as any[];

    // gfx.drawPolygon(allPoints)

    this.container.hitArea = new PIXI.Polygon(allPoints);
    this.container.interactive = true;
    this.container.buttonMode = true;
  };

  addDragEvents(): any[] {
    return [];
  }
}
