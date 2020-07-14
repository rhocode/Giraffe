import EdgeTemplate, {
  EdgeContainer,
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
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import Bezier from 'bezier-js';

export default class SimpleEdge implements EdgeTemplate {
  container: EdgeContainer;
  graphicsObject: PIXI.Graphics;
  edgeId: string;
  targetNode: NodeTemplate;
  sourceNode: NodeTemplate;
  sourceDot: PIXI.Sprite;
  targetDot: PIXI.Sprite;

  private selected: boolean = false;

  constructor(props: SatisGraphtoryEdgeProps) {
    const { sourceNode, targetNode } = props;

    const container = new EdgeContainer();
    this.container = container;
    this.edgeId = props.edgeId;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;

    container.setHighLight(new PIXI.Graphics());
    container.addChild(container.getHighLight());

    this.graphicsObject = new PIXI.Graphics();
    container.addChild(this.graphicsObject);

    const inputDotTexture = PIXI.utils.TextureCache['outCircle'];
    const inputDot = Dot(inputDotTexture, 0, 0);

    const outDotTexture = PIXI.utils.TextureCache['inCircle'];
    const outputDot = Dot(outDotTexture, 0, 0);

    this.sourceDot = inputDot;
    this.targetDot = outputDot;

    container.addChild(inputDot);
    container.addChild(outputDot);

    sourceNode.addEdge(this, EdgeType.OUTPUT);
    targetNode.addEdge(this, EdgeType.INPUT);

    this.updateWithoutHitBox();
  }

  updateWithoutHitBox = () => {
    const { x: sourceX, y: sourceY } = this.sourceNode.getOutputCoordinate(
      this.edgeId,
      EdgeType.OUTPUT
    );
    const { x: targetX, y: targetY } = this.targetNode.getOutputCoordinate(
      this.edgeId,
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

    if (this.selected) {
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
    }

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
}
