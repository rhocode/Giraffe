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

  const urlParams = new URLSearchParams(window.location.search);

  const countNodes = urlParams.get('countNodes') || 0;

  if (countNodes) {
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

    console.log("I'm counting the nodes!");

    const num = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(
      ' '
    );
    const tens = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(
      ' '
    );

    function number2words(n: number): string {
      if (n < 20) return num[n];
      const digit = n % 10;
      if (n < 100)
        return tens[~~(n / 10) - 2] + (digit ? '-' + num[digit] : '');
      if (n < 1000)
        return (
          num[~~(n / 100)] +
          ' hundred' +
          (n % 100 === 0 ? '' : ' ' + number2words(n % 100))
        );
      return (
        number2words(~~(n / 1000)) +
        ' thousand' +
        (n % 1000 !== 0 ? ' ' + number2words(n % 1000) : '')
      );
    }

    for (let i = 0; i < numNodes; i++) {
      console.log('Adding node number ' + number2words(i + 1) + '!');
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

    console.log(
      "And that's it! We counted from one to " + number2words(numNodes) + '!'
    );

    console.timeEnd('loadNodes');
  } else {
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
  }
};

export default initRuntime;
