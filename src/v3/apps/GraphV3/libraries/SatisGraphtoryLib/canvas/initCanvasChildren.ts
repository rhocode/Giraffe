import {
  getAllBuildableMachines,
  getBuildingName,
} from 'v3/data/loaders/buildings';
import { Viewport } from 'pixi-viewport';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import stringGen from 'v3/utils/stringGen';
import { getMachineCraftableRecipeList } from 'v3/data/loaders/recipes';
import SimpleEdge from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/SimpleEdge';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

const initCanvasChildren = (
  pixiJS: PIXI.Application,
  viewport: Viewport,
  translate: (source: string) => string
) => {
  console.log('Initing canvas state');

  // const urlParams = new URLSearchParams(window.location.search);
  //
  // const numNodes = parseInt(urlParams.get('numNodes') || '', 10) || 10;

  console.time('loadNodes');

  const recipes = getMachineCraftableRecipeList();
  const machines = getAllBuildableMachines();

  const children: (NodeTemplate | EdgeTemplate)[] = [];

  // This is to debug the connections
  const connections = [];

  const initialConnectionsMap = new Map<any, any>();

  for (let i = 0; i < 3; i++) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const machine = machines[Math.floor(Math.random() * machines.length)];

    const nodeData = {
      position: {
        x: 400 * i, //Math.random() * viewport.screenWidth,
        y: 400 * i, //Math.random() * viewport.screenHeight,
      },
      nodeId: stringGen(10),
      recipeLabel: translate(recipe) as string,
      recipeName: recipe as string,
      tier: Math.floor(Math.random() * 7),
      overclock: Math.floor(Math.random() * 200),
      machineName: machine as string,
      machineLabel: getBuildingName(machine) as string,
      inputs: Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()),
      outputs: Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()),
    };

    connections.push(nodeData.nodeId);

    const newNode = new AdvancedNode(nodeData);

    initialConnectionsMap.set(nodeData.nodeId, {
      input: {
        x: newNode.container.inputX,
        ys: newNode.container.inputMapping,
      },
      output: {
        x: newNode.container.outputX,
        ys: newNode.container.outputMapping,
      },
    });

    children.push(newNode);
  }

  for (let i = 0; i < connections.length - 1; i++) {
    const from = connections[i];
    const to = connections[i + 1];

    const fromMap = initialConnectionsMap.get(from)!;

    const toMap = initialConnectionsMap.get(to)!;

    const edgeProps = {
      edgeId: stringGen(10),
      type: 'cool', // should be fluid type?
      sourceId: from,
      targetId: to,
      source: {
        x: fromMap.output.x,
        y: fromMap.output.ys[0],
      },
      target: {
        x: toMap.input.x,
        y: toMap.input.ys[0],
      },
    };

    const edge = new SimpleEdge(edgeProps);
    children.push(edge);
  }

  console.timeEnd('loadNodes');

  // Here we should generate and add the children

  return children;
};

export default initCanvasChildren;
