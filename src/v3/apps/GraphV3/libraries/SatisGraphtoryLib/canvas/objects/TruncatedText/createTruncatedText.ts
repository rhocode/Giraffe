import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { RECIPE_FONT_OFFSET } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/consts';
import createText from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/TruncatedText/createText';

const createTruncatedText = (
  text: string,
  maxWidth: number,
  style: PIXI.TextStyle,
  x: number,
  y: number,
  align = 'left'
) => {
  const baseMetrics = PIXI.TextMetrics.measureText(text, style);
  let displayedString;

  if (baseMetrics.lineWidths[0] < maxWidth - RECIPE_FONT_OFFSET) {
    displayedString = baseMetrics.lines[0];
    if (baseMetrics.lineWidths.length > 1) {
      displayedString += '...';
    }
  } else {
    const newMetrics = PIXI.TextMetrics.measureText(
      `${baseMetrics.lines[0]}...`,
      style
    );
    displayedString = `${newMetrics.lines[0]}...`;
  }

  return createText(displayedString, style, x, y, align);
};

export default createTruncatedText;
