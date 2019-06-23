import {imageRepository} from '../repositories/imageRepository';
import MachineNode, {GraphNode} from "../datatypes/graphNode";

const img = imageRepository.machines['constructor.png'];

// function drawNodePlug

function drawNodePlug(context: any, x: number, y: number, backgroundColor: string, foregroundColor: string) {
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

export function defaultNodeTheme(context: any, d: GraphNode) {
  context.save();

  const w = 180;
  const h = 150;

  const x = d.x - w / 2;
  const y = d.y - h / 2;

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

  context.drawImage(img, x + 8, y + 10, 100, 100); // Or at whatever offset you like

  context.font = '15px Roboto';
  context.fillStyle = 'white';
  context.fillText('IRON INGOT (Alt.)', x + 5, y + h - 10);

  context.font = '25px Roboto Condensed';
  context.fillStyle = 'white';
  context.fillText('Mk. II', d.x + 20, d.y - 20);

  context.font = '25px Roboto Condensed';
  context.fillStyle = '#15CB07';
  context.fillText('100%', d.x + 20, d.y + 10);

  // Reset the slot mappings;
  d.inputSlotMapping = {};
  d.outputSlotMapping = {};

  calculateNodeSpacing(d.y, d.inputSlots.length).forEach((inputY: number, index: number) => {
    d.inputSlotMapping[index] = {x: d.x - (w / 2), y: inputY};
    drawNodePlug(context, d.x - (w / 2), inputY, '#1D1E20', '#15CB07');
  });

  calculateNodeSpacing(d.y, d.outputSlots.length).forEach((outputY: number, index: number) => {
    d.outputSlotMapping[index] = {y: outputY, x: d.x + (w / 2)};
    drawNodePlug(context, d.x + (w / 2), outputY, '#1D1E20', '#FFA328');
  });

  context.restore();
}

const defaultNodePlugSpacing = 25;

function calculateNodeSpacing(y: number, n: number): number[] {
  if (n === 0) {
    return [];
  }

  const totalSize = (n - 1) * defaultNodePlugSpacing;
  const minY = y - totalSize/2;

  const output = [];
  for(let i = 0; i < n; i++) {
    output.push(minY + (i * defaultNodePlugSpacing));
  }

  return output;
}

export function drawPath(context: any, source: MachineNode, target: MachineNode, sourceIndex: number, targetIndex: number) {
  context.save();
  context.beginPath();

  const outputSlot = source.outputSlotMapping[sourceIndex];
  const targetIndexes = target.inputSlots.map((item, index) => item === source ? index : null).filter(item => item !== null);
  const targetIndexSlot = (targetIndexes.length > 1 ? targetIndexes[targetIndex] : target.inputSlots.indexOf(source)) || 0;
  const inputSlot = target.inputSlotMapping[targetIndexSlot];

  const x1 = source.fx + outputSlot.x;
  const y1 = source.fy + outputSlot.y;
  const x2 = target.fx + inputSlot.x;
  const y2 = target.fy + inputSlot.y;
  const avg = (x1 + x2) / 2;

  context.strokeStyle = '#7122D5';
  context.lineWidth  = 8;

  context.moveTo(x1, y1);

  // context.lineTo(x2, y2);
  // console.error(x1, y1, x2, y2);
  context.bezierCurveTo(avg, y1, avg, y2, x2, y2);
  context.stroke();
  context.restore();
}


export function defaultNodeThemeSprite(context: any, d: GraphNode) {
  context.save();

  const w =  d.width - d.xRenderBuffer;
  const h =  d.height - d.yRenderBuffer;

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

  context.drawImage(img, x + 3, y + 4, 100, 100); // Or at whatever offset you like

  context.font = '15px Roboto Condensed';
  context.fillStyle = 'white';
  context.fillText('IRON INGOT (Alt.)', x + 6, y + h - 10);

  context.font = '25px Roboto Condensed';
  context.fillStyle = 'white';
  context.fillText('Mk. II', (w/2) + 30, (h/2) - 10);

  context.font = '25px Roboto Condensed';
  context.fillStyle = '#15CB07';
  context.fillText('100%', (w/2) + 30, (h/2) + 20);

  // Reset the slot mappings
  d.inputSlotMapping = {};
  d.outputSlotMapping = {};

  calculateNodeSpacing(y + (h/2), d.inputSlots.length).forEach((inputY: number, index: number) => {
    d.inputSlotMapping[index] = {x, y: inputY};
    drawNodePlug(context, x, inputY, '#1D1E20', '#15CB07');
  });

  calculateNodeSpacing(y + (h/2), d.outputSlots.length).forEach((outputY: number, index: number) => {
    d.outputSlotMapping[index] = {x: x + w, y: outputY};
    drawNodePlug(context, x + w, outputY, '#1D1E20', '#FFA328');
  });

  context.restore();
}