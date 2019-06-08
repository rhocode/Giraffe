import { imageRepository } from '../repositories/imageRepository';

const img = imageRepository.machines['Constructor.png'];

export function defaultNodeTheme(context: any, d: any) {
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

  // context.drawImage(img, x + 3, y + 10, 100, 100); // Or at whatever offset you like

  context.font = '15px Roboto Condensed';
  context.fillStyle = 'white';
  context.fillText('IRON INGOT', x + 5, y + h - 10);

  context.beginPath();
  context.arc(d.x, d.y, 5, 0, 2 * Math.PI, true);
  context.fillStyle = 'red';
  context.fill();
  context.restore();
}
