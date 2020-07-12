import EdgeTemplate, {
  EdgeContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { LINE_THICKNESS } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import { ORANGE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import { Dot } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';

export default class SimpleEdge implements EdgeTemplate {
  container: EdgeContainer;
  graphic: PIXI.Graphics;
  edgeId: string;
  targetNode: AdvancedNode;
  sourceNode: AdvancedNode;
  sourceDot: PIXI.Sprite;
  targetDot: PIXI.Sprite;

  constructor(props: SatisGraphtoryEdgeProps) {
    const { sourceNode, targetNode } = props;

    const container = new EdgeContainer();
    this.container = container;

    const curve = new PIXI.Graphics();
    this.graphic = curve;
    container.addChild(curve);

    this.edgeId = props.edgeId;

    this.sourceNode = sourceNode;
    this.targetNode = targetNode;

    //
    // const source = {x: 1, y: 1};
    // const target = {x: 1, y: 1};
    //
    // const { x: sX, y: sY } = source;
    // const { x: tX, y: tY } = target;
    // curve.lineStyle(LINE_THICKNESS, ORANGE, 1);
    // curve.moveTo(sX, sY);
    //
    // const dX = Math.abs(tX - sX) * (3/4);
    //
    //
    //
    // curve.bezierCurveTo(sX + dX, sY, tX - dX, tY, tX, tY);
    // // curve.bezierCurveTo(dX, sY, sX, dY, tX, tY);
    // container.addChild(curve);
    //
    const inputDotTexture = PIXI.utils.TextureCache['inCircle'];
    const inputDot = Dot(inputDotTexture, 0, 0);

    const outDotTexture = PIXI.utils.TextureCache['outCircle'];
    const outputDot = Dot(outDotTexture, 0, 0);

    this.sourceDot = inputDot;
    this.targetDot = outputDot;

    container.addChild(inputDot);
    container.addChild(outputDot);
  }

  update() {
    const sourceIndex = this.sourceNode.edgeMap.get(this.edgeId)!;
    const targetIndex = this.targetNode.edgeMap.get(this.edgeId)!;

    // Ugh, this is inside the container :(
    const sourceY = this.sourceNode.container.outputMapping[sourceIndex];
    const targetY = this.targetNode.container.inputMapping[targetIndex];
    const sourceX = this.sourceNode.container.outputX;
    const targetX = this.targetNode.container.inputX;

    this.sourceDot.position.x = sourceX;
    this.sourceDot.position.y = sourceY;
    this.targetDot.position.x = targetX;
    this.targetDot.position.y = targetY;

    this.graphic.clear();
    this.graphic.lineStyle(LINE_THICKNESS, ORANGE, 1);
    this.graphic.moveTo(sourceX, sourceY);

    const dX = Math.abs(targetX - sourceX) * (3 / 4);
    const dY = Math.abs(targetY - sourceY) * 0;

    this.graphic.bezierCurveTo(
      sourceX + dX,
      sourceY + dY,
      targetX - dX,
      targetY - dY,
      targetX,
      targetY
    );
    // const target = {x: 1, y: 1};
  }
}
