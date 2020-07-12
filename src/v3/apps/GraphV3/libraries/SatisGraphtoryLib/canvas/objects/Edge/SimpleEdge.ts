import EdgeTemplate, {
  EdgeContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { SatisGraphtoryEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { LINE_THICKNESS } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import { ORANGE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';

export default class SimpleEdge implements EdgeTemplate {
  container: EdgeContainer;

  constructor(props: SatisGraphtoryEdge) {
    const { source, target } = props;

    const { x: sX, y: sY } = source;
    const { x: tX, y: tY } = target;

    const container = new EdgeContainer();
    this.container = container;

    const curve = new PIXI.Graphics();
    curve.lineStyle(LINE_THICKNESS, ORANGE, 1);
    curve.moveTo(sX, sY);

    const dX = Math.abs(tX - sX) / 2;

    curve.bezierCurveTo(sX + dX, sY, tX - dX, tY, tX, tY);
    // curve.bezierCurveTo(dX, sY, sX, dY, tX, tY);
    container.addChild(curve);

    console.log(props);
  }
}
