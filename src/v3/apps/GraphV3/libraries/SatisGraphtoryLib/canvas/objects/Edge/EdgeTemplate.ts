import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';

export class EdgeContainer extends PIXI.Container {}

export default interface EdgeTemplate {
  container: EdgeContainer;
}
