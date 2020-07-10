import { Node } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/Node';
import { getMachineCraftableItems } from 'v3/data/loaders/items';
import { getAllBuildableMachines } from 'v3/data/loaders/buildings';
import { Viewport } from 'pixi-viewport';

const initCanvasChildren = (pixiJS: PIXI.Application, viewport: Viewport) => {
  console.log('Initing canvas state');

  const urlParams = new URLSearchParams(window.location.search);

  const numNodes = parseInt(urlParams.get('numNodes') || '', 10) || 10;

  console.time('loadNodes');
  const testNode = Node(
    100,
    100,
    'item-electromagnetic-control-rod',
    '30/30 (100.0%)',
    '30/30 (100.0%)',
    'Mk 1',
    100.0,
    'building-assembler-mk1',
    2,
    4
  );

  const items = getMachineCraftableItems();
  const machines = getAllBuildableMachines();

  const children: PIXI.DisplayObject[] = [];

  for (let i = 0; i < numNodes; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const tNode = Node(
      Math.random() * viewport.screenWidth,
      Math.random() * viewport.screenHeight,
      item,
      '30/30 (100.0%)',
      '30/30 (100.0%)',
      'Mk 1',
      Math.floor(Math.random() * 200),
      machine,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5)
    );
    children.push(tNode);
  }
  children.push(testNode);

  console.timeEnd('loadNodes');
  return children;
};

export default initCanvasChildren;
