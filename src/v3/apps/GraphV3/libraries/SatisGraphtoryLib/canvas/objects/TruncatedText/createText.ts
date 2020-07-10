import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
// import {sgDevicePixelRatio} from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils";

const createText = (
  text: string,
  style: PIXI.TextStyle,
  x: number,
  y: number
) => {
  const nameStr = new PIXI.Text(text, style);
  nameStr.anchor.set(0, 0.5);
  nameStr.position.x = x;
  nameStr.position.y = y;
  // nameStr.resolution = sgDevicePixelRatio * 2;
  return nameStr;
};

export default createText;
