import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import stringGen from 'v3/utils/stringGen';

export class NodeContainer extends PIXI.Container {
  public boundCalculator: any = null;
  public nodeId: string = stringGen(10);
  public highLight: any = null;
}

export interface NodeTemplate {
  container: NodeContainer;
}
