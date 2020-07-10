import { Viewport } from 'pixi-viewport';
import { ORANGE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import drawDashedPolygon from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/drawDashedPolygon';

export const drawSelectionBox = (
  context: PIXI.Graphics,
  x1: number,
  y1: number,
  width: number,
  height: number,
  dash: number,
  gap: number
) => {
  context.moveTo(x1, y1);
  context.lineStyle(3, ORANGE, 1);

  const offsetInterval = 300;
  const offset = ((Date.now() % offsetInterval) + 1) / offsetInterval;
  drawDashedPolygon(
    context,
    [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ],
    x1,
    y1,
    0,
    10,
    5,
    offset
  );
};

export const enableSelectionBox = (
  pixiViewport: Viewport,
  viewportChildContainer: PIXI.Container,
  selectionBox: PIXI.Graphics
) => {
  let dragging = false;
  let clickX = 0;
  let clickY = 0;

  viewportChildContainer.on('pointerdown', function (this: any, event: any) {
    event.stopPropagation();
    const newPos = event.data.getLocalPosition(this.parent);
    clickX = newPos.x;
    clickY = newPos.y;
    dragging = true;
  });

  viewportChildContainer.on('pointerup', () => {
    dragging = false;
    selectionBox.clear();
  });

  viewportChildContainer.on('pointerupoutside', () => {
    dragging = false;
    selectionBox.clear();
  });

  viewportChildContainer.on('pointermove', function (this: any, event: any) {
    if (dragging) {
      event.stopPropagation();
      const newPos = event.data.getLocalPosition(this.parent);

      selectionBox.clear();
      const minX = Math.min(clickX, newPos.x);
      const minY = Math.min(clickY, newPos.y);
      const deltaX = Math.abs(clickX - newPos.x);
      const deltaY = Math.abs(clickY - newPos.y);

      drawSelectionBox(selectionBox, minX, minY, deltaX, deltaY, 16, 8);
    }
  });
};
