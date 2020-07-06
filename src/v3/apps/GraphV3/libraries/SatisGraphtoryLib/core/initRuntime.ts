// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';

import { addChild } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { Node } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/Node';
import { loadSharedTextures } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/loadSharedTextures';
import { getMachineCraftableItems } from 'v3/data/loaders/items';
import { getAllBuildableMachines } from 'v3/data/loaders/buildings';

const initRuntime = (pixiJS: any, numNodes: number) => {
  if (!pixiJS.renderer) {
    return;
  }

  console.time('loadSharedTextures');
  loadSharedTextures(pixiJS.renderer);
  console.timeEnd('loadSharedTextures');

  // TODO: replace the constructor with a defined object, like
  // const nodeData = {
  //   x: ??,
  //   y: ??,
  //   input: ??,
  //   etc
  // }
  //
  // const testNode = Node(nodeData)

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

  for (let i = 0; i < numNodes; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const tNode = Node(
      Math.random() * pixiJS.stage.width,
      Math.random() * pixiJS.stage.height,
      item,
      '30/30 (100.0%)',
      '30/30 (100.0%)',
      'Mk 1',
      Math.floor(Math.random() * 200),
      machine,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5)
    );
    addChild(tNode);
  }
  addChild(testNode);

  console.timeEnd('loadNodes');
};

export default initRuntime;
