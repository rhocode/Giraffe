import { GraphNode } from '../datatypes/graph/graphNode';
import { GraphEdge } from '../datatypes/graph/graphEdge';
import { stringRound } from '../utils/stringUtils';

function drawNodePlug(
  context: any,
  x: number,
  y: number,
  backgroundColor: string,
  foregroundColor: string
) {
  // context.save();
  context.beginPath();
  context.arc(x, y, 12, 0, 2 * Math.PI, true);
  context.fillStyle = backgroundColor;
  context.fill();
  context.beginPath();
  context.arc(x, y, 8, 0, 2 * Math.PI, true);
  context.fillStyle = foregroundColor;
  context.fill();
  // context.restore();
}

const defaultNodePlugSpacing = 25;

function calculateNodeSpacing(y: number, n: number): number[] {
  if (n === 0) {
    return [];
  }

  const totalSize = (n - 1) * defaultNodePlugSpacing;
  const minY = y - totalSize / 2;

  const output = [];
  for (let i = 0; i < n; i++) {
    output.push(minY + i * defaultNodePlugSpacing);
  }

  return output;
}

export function drawPath(context: any, graphEdge: GraphEdge) {
  context.save();
  graphEdge.paintEdge(context);
  context.restore();
}

export function defaultNodeThemeSpriteOutline(context: any, d: GraphNode) {
  context.save();

  const w = d.width;
  // - d.xRenderBuffer;
  const h = d.height;
  // - d.yRenderBuffer;

  const x = d.xRenderBuffer;
  const y = d.yRenderBuffer;

  let r = 6;

  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
  context.lineWidth = 20;
  context.strokeStyle = '#E65100';
  context.stroke();

  context.restore();
}

export function defaultNodeThemeSprite(
  context: any,
  d: GraphNode,
  dataLibrary: any = null
) {
  context.save();

  const w = d.width;
  const h = d.height;

  const x = d.xRenderBuffer;
  const y = d.yRenderBuffer;

  let r = 6;

  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
  context.lineWidth = 4;
  context.strokeStyle = '#D4CE22';
  context.fillStyle = '#313234';
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(x + w, y + h - 35);
  context.lineTo(x + w, y + h - r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.lineTo(x, y + h - 35);
  context.lineTo(x + w, y + h - 35);
  context.closePath();
  context.fillStyle = '#1D1E20';
  context.lineWidth = 2;
  context.strokeStyle = '#D4CE22';
  context.fill();
  context.stroke();

  context.drawImage(d.getImage(), x + 13, y + 5, 90, 90); // Or at whatever offset you like

  context.font = '15px Roboto Condensed';
  context.fillStyle = 'white';
  const text = d.getTagLine().toUpperCase();

  context.fillText(text, x + 6, y + h - 12);

  // context.textBaseline = "middle";
  context.font = '25px Roboto Condensed';
  context.fillStyle = 'white';
  context.fillText(d.getVersion(), x + w / 2 + 10, y + h / 2 - 20);

  context.font = '25px Roboto Condensed';
  context.fillStyle = '#15CB07';
  context.fillText('100%', x + w / 2 + 10, y + h / 2 + 10);

  // Reset the slot mappings
  d.inputSlotMapping = {};
  d.outputSlotMapping = {};

  let startingIndex = y + h + 10;
  if (d.inputPropagationData.size && dataLibrary) {
    d.inputPropagationData.forEach((value, key) => {
      const itemLookup = dataLibrary.itemEnums.get(key);
      // const displayName = d.getTranslation(itemLookup.name);
      const displayImage = dataLibrary.itemImages[itemLookup.name];
      context.drawImage(displayImage, x + 10, startingIndex, 20, 20);

      const numerator = value.numerator;
      const denominator = value.denominator;

      const decimalPercentage = stringRound(value.toNumber() * 100, 1);

      context.font = '20px Roboto Condensed';
      context.fillStyle = '#15CB07';
      context.fillText(
        `${numerator}/${denominator} (${decimalPercentage}%)`,
        x + 10 + 30,
        startingIndex + 15
      );
      startingIndex += 30;
    });
  }

  if (d.outputPropagationData.size && dataLibrary) {
    d.outputPropagationData.forEach((value, key) => {
      const itemLookup = dataLibrary.itemEnums.get(key);
      // const displayName = d.getTranslation(itemLookup.name);
      const displayImage = dataLibrary.itemImages[itemLookup.name];
      context.drawImage(displayImage, x + 10, startingIndex, 20, 20);

      const numerator = value.numerator;
      const denominator = value.denominator;

      const decimalPercentage = stringRound(value.toNumber() * 100, 1);

      context.font = '20px Roboto Condensed';
      context.fillStyle = '#FFA328';
      context.fillText(
        `${numerator}/${denominator} (${decimalPercentage}%)`,
        x + 10 + 30,
        startingIndex + 15
      );
      startingIndex += 30;
    });
  }

  // TODO: refactor so that the node spacing can be calculated based on height and width, etc
  calculateNodeSpacing(y + h / 2, d.inputSlots.length).forEach(
    (inputY: number, index: number) => {
      d.inputSlotMapping[index] = { x, y: inputY };
      // console.log(d.inputSlots, d.id)
      drawNodePlug(context, x, inputY, '#1D1E20', '#15CB07');
    }
  );

  calculateNodeSpacing(y + h / 2, d.outputSlots.length).forEach(
    (outputY: number, index: number) => {
      d.outputSlotMapping[index] = { x: x + w, y: outputY };
      drawNodePlug(context, x + w, outputY, '#1D1E20', '#FFA328');
    }
  );

  context.restore();
}
