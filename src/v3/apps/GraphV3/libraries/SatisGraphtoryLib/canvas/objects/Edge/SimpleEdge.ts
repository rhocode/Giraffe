import EdgeTemplate, {
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  LINE_HIGHLIGHT_THICKNESS,
  LINE_THICKNESS,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import { Dot } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/Dot';
import Bezier from 'bezier-js';
import createText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createText';
import { getTierText } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/tierUtils';
import { EDGE_TIER_STYLE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/style/textStyles';
import { getTier } from 'v3/data/loaders/buildings';
import { EdgeAttachmentSide } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeAttachmentSide';

export default class SimpleEdge extends EdgeTemplate {
  graphicsObject: PIXI.Graphics;
  sourceDot: PIXI.Sprite;
  targetDot: PIXI.Sprite;

  private selected: boolean = false;
  private hitBoxEnabled = false;

  private levelText: any;

  constructor(props: SatisGraphtoryEdgeProps) {
    super(props);

    if (!this.connectorName)
      throw new Error(
        'SimpleEdge must be instantiated with a valid connector name'
      );

    this.container.setHighLightObject(new PIXI.Graphics());
    this.container.addChild(this.container.getHighLight());
    this.container.setHighLightOn(false);

    this.graphicsObject = new PIXI.Graphics();
    this.container.addChild(this.graphicsObject);

    const inputDotTexture = PIXI.utils.TextureCache['outCircle'];
    const inputDot = Dot(inputDotTexture, 0, 0);

    const outDotTexture = PIXI.utils.TextureCache['inCircle'];
    const outputDot = Dot(outDotTexture, 0, 0);

    const tier = getTier(this.connectorName);

    const theme = this.getInteractionManager().getTheme();

    this.levelText = tier
      ? createText(getTierText(tier), EDGE_TIER_STYLE(theme), 0, 0, 'center')
      : null;

    if (this.levelText) {
      this.container.addChild(this.levelText);
    }

    this.sourceDot = inputDot;
    this.targetDot = outputDot;

    this.container.addChild(inputDot);
    this.container.addChild(outputDot);

    if (!props.ignoreLinking) {
      if (!this.sourceNode || !this.targetNode) {
        throw new Error('Cannot instantiate non-connected simple-edge');
      }

      if (
        this.sourceNode.isBiDirectional() &&
        this.targetNode.isBiDirectional()
      ) {
        this.biDirectional = true;
      }

      this.sourceNode.addEdge(
        this,
        EdgeType.OUTPUT,
        props.useProvidedAttachmentSides
      );

      this.targetNode.addEdge(
        this,
        EdgeType.INPUT,
        props.useProvidedAttachmentSides
      );

      this.updateWithoutHitBox();
    }
  }

  addSelectEvents(onSelectObjects: (ids: string[]) => any): void {
    this.enableHitBox();
    this.container.on('pointerdown', function (this: any, event: any) {
      event.stopPropagation();
    });

    this.container.on('click', function (this: any, event: any) {
      event.stopPropagation();
      onSelectObjects([this.id]);
    });
  }

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
    if (!this.sourceNode || !this.targetNode) {
      throw new Error('Invalid update');
    }

    const { x: sourceX, y: sourceY } = this.sourceNode.getConnectionCoordinate(
      this
    );

    const { x: targetX, y: targetY } = this.targetNode.getConnectionCoordinate(
      this
    );

    this.sourceDot.position.x = sourceX;
    this.sourceDot.position.y = sourceY;
    this.targetDot.position.x = targetX;
    this.targetDot.position.y = targetY;

    this.graphicsObject.clear();
    this.container.getHighLight().clear();
    // TODO: Fix the edge color

    const theme = this.getInteractionManager().getTheme();

    this.graphicsObject.lineStyle(LINE_THICKNESS, theme.edges.default, 1);
    this.graphicsObject.moveTo(sourceX, sourceY);

    const multiplierX = sourceX > targetX ? -1 : 1;
    const multiplierY = sourceY > targetY ? -1 : 1;

    let ptX1 = sourceX;
    let ptX2 = targetX;
    let ptY1 = sourceY;
    let ptY2 = targetY;

    switch (this.sourceNodeAttachmentSide) {
      case EdgeAttachmentSide.RIGHT:
      case EdgeAttachmentSide.LEFT:
        switch (this.targetNodeAttachmentSide) {
          case EdgeAttachmentSide.RIGHT:
          case EdgeAttachmentSide.LEFT:
            const changeX = Math.abs(targetX - sourceX) * (3 / 4) * multiplierX;
            ptX1 += changeX;
            ptX2 -= changeX;
            break;
          case EdgeAttachmentSide.TOP:
          case EdgeAttachmentSide.BOTTOM:
            ptX1 += Math.abs(targetX - sourceX) * (1 / 2) * multiplierX;
            ptY2 -= Math.abs(targetY - sourceY) * (1 / 2) * multiplierY;
            break;
        }
        break;
      case EdgeAttachmentSide.TOP:
      case EdgeAttachmentSide.BOTTOM:
        switch (this.targetNodeAttachmentSide) {
          case EdgeAttachmentSide.TOP:
          case EdgeAttachmentSide.BOTTOM:
            const changeY = Math.abs(targetY - sourceY) * (3 / 4) * multiplierY;
            ptY1 += changeY;
            ptY2 -= changeY;
            break;
          case EdgeAttachmentSide.RIGHT:
          case EdgeAttachmentSide.LEFT:
            ptY1 += Math.abs(targetY - sourceY) * (1 / 2) * multiplierY;
            ptX2 -= Math.abs(targetX - sourceX) * (1 / 2) * multiplierX;
            break;
        }
        break;
    }

    const highLight = this.container.getHighLight();
    highLight.moveTo(sourceX, sourceY);
    highLight.lineStyle(LINE_HIGHLIGHT_THICKNESS, theme.edges.highlight, 1);

    const curve = new Bezier(
      sourceX,
      sourceY,
      ptX1,
      ptY1,
      ptX2,
      ptY2,
      targetX,
      targetY
    );

    const { x: midpointX, y: midpointY } = curve.get(0.5);

    if (this.levelText) {
      this.levelText.position.x = midpointX;
      this.levelText.position.y = midpointY;
    }

    const points = curve.getLUT(100);
    const polygon = new PIXI.Polygon(points);
    polygon.closeStroke = false;

    highLight.drawShape(polygon);
    this.graphicsObject.drawShape(polygon);

    return {
      targetX,
      targetY,
      curve,
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
    const { targetX, targetY, curve } = this.updateWithoutHitBox();

    if (!this.hitBoxEnabled) {
      this.container.hitArea = null;
      this.container.interactive = false;
      this.container.buttonMode = false;
      return;
    }

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
