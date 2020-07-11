import { Viewport } from 'pixi-viewport';
import { ORANGE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { NodeContainer } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

export const drawSelectionBox = (
  context: PIXI.Graphics,
  x1: number,
  y1: number,
  width: number,
  height: number
  // dash: number,
  // gap: number
) => {
  context.lineStyle(4, ORANGE, 1);
  context.beginFill(ORANGE, 0.15);
  context.drawRect(x1, y1, width, height);
  //
  // context.moveTo(x1, y1);
  // context.lineStyle(4, ORANGE, 1);
  //
  // // const offsetInterval = 300;
  // // const offset = ((Date.now() % offsetInterval) + 1) / offsetInterval;
  //
  // drawDashedPolygon(
  //   context,
  //   [
  //     { x: 0, y: 0 },
  //     { x: width, y: 0 },
  //     { x: width, y: height },
  //     { x: 0, y: height },
  //   ],
  //   x1,
  //   y1,
  //   0,
  //   dash,
  //   gap,
  //   0
  // );
};

export const enableSelectionBox = (
  pixiViewport: Viewport,
  viewportChildContainer: PIXI.Container,
  selectionBox: PIXI.Graphics,
  selectionCallback: (nodeIds: string[]) => any
) => {
  let dragging = false;
  let clickX = 0;
  let clickY = 0;

  // function stopSelection() {
  //   const selected = viewportChildContainer.children.filter(child => {
  //     return child instanceof NodeContainer;
  //   }).filter(child => {
  //     const thisBound = child.getLocalBounds();
  //     const inBounds = thisBound.contains(minX, minY)
  //       && thisBound.contains(minX + deltaX, minY)
  //       && thisBound.contains(minX + deltaX, minY + deltaY)
  //       && thisBound.contains(minX, minY + deltaY);
  //
  //     if (inBounds) {
  //
  //     } else {
  //       child.alpha = 0.2
  //     }
  //   })
  // }

  let selected: NodeContainer[] = [];
  let possibleNodes: NodeContainer[] = [];

  function clearSelection() {
    if (!dragging) return;

    dragging = false;
    selectionBox.clear();
    possibleNodes.forEach((node) => {
      // node.highLight.visible = false;
      node.alpha = 1;
    });

    // selected.forEach((node) => {
    //   node.highLight.visible = true;
    // });

    const selectedNodes = selected.map((item) => item.nodeId);
    selected = [];
    possibleNodes = [];

    selectionCallback(selectedNodes);
  }

  viewportChildContainer.on('pointerdown', function (this: any, event: any) {
    event.stopPropagation();
    possibleNodes = (viewportChildContainer.children.filter((child) => {
      let isPossible = child instanceof NodeContainer;
      if (isPossible) {
        ((child as unknown) as NodeContainer).highLight.visible = false;
      }

      return isPossible;
    }) as unknown) as NodeContainer[];

    const newPos = event.data.getLocalPosition(this.parent);
    clickX = newPos.x;
    clickY = newPos.y;
    dragging = true;
  });

  viewportChildContainer.on('pointerup', (event: any) => {
    clearSelection();
  });

  viewportChildContainer.on('pointerupoutside', (event: any) => {
    clearSelection();
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

      const { x: left, y: top } = pixiViewport.toScreen(minX, minY);
      const { x: right, y: bottom } = pixiViewport.toScreen(
        minX + deltaX,
        minY + deltaY
      );

      selected = possibleNodes.filter((child) => {
        const thisBound = ((child as unknown) as NodeContainer).boundCalculator.getBounds();

        const inBounds =
          thisBound.left >= left &&
          thisBound.right <= right &&
          thisBound.top >= top &&
          thisBound.bottom <= bottom;

        if (inBounds) {
          child.alpha = 1;
        } else if (selected.length === 0) {
          child.alpha = 1;
        } else {
          child.alpha = 0.2;
        }

        return inBounds;
      });

      drawSelectionBox(selectionBox, minX, minY, deltaX, deltaY);
    }
  });
};
