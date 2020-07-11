import {
  getAllBuildableMachines,
  getBuildingName,
} from 'v3/data/loaders/buildings';
import { Viewport } from 'pixi-viewport';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import stringGen from 'v3/utils/stringGen';
import { getMachineCraftableRecipeList } from 'v3/data/loaders/recipes';

const initCanvasChildren = (
  pixiJS: PIXI.Application,
  viewport: Viewport,
  translate: (source: string) => string
) => {
  console.log('Initing canvas state');

  const urlParams = new URLSearchParams(window.location.search);

  const numNodes = parseInt(urlParams.get('numNodes') || '', 10) || 10;

  console.time('loadNodes');

  const recipes = getMachineCraftableRecipeList();
  const machines = getAllBuildableMachines();

  const children: NodeTemplate[] = [];

  for (let i = 0; i < numNodes; i++) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const machine = machines[Math.floor(Math.random() * machines.length)];

    const nodeData = {
      position: {
        x: Math.random() * viewport.screenWidth,
        y: Math.random() * viewport.screenHeight,
      },
      nodeId: stringGen(10),
      recipeLabel: translate(recipe) as string,
      recipeName: recipe as string,
      tier: Math.floor(Math.random() * 7),
      overclock: Math.floor(Math.random() * 200),
      machineName: machine as string,
      machineLabel: getBuildingName(machine) as string,
      inputs: Array.from(Array(Math.floor(Math.random() * 5)).keys()),
      outputs: Array.from(Array(Math.floor(Math.random() * 5)).keys()),
    };

    const newNode = new AdvancedNode(nodeData);

    children.push(newNode);
  }

  console.timeEnd('loadNodes');
  return children;
};

export default initCanvasChildren;
