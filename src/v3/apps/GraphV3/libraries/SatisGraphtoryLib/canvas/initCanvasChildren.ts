import {
  getAllBuildableMachines,
  getBuildingName,
  getInputsForBuilding,
  getOutputsForBuilding,
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
  console.log('Creating canvas state');

  const urlParams = new URLSearchParams(window.location.search);

  const numNodes = parseInt(urlParams.get('numNodes') || '', 10) || 10;

  console.time('loadNodes');

  const recipes = getMachineCraftableRecipeList();
  const machines = getAllBuildableMachines();

  const children: (NodeTemplate | EdgeTemplate)[] = [];

  // This is to debug the connections
  const connections = [];

  const initialConnectionsMap = new Map<any, any>();

  for (let i = 0; i < numNodes; i++) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    let machine = machines[Math.floor(Math.random() * machines.length)];

    if (
      !getInputsForBuilding(machine as string).length ||
      !getOutputsForBuilding(machine as string).length
    ) {
      machine = machines[0];
    }

    const nodeData = {
      position: {
        x: 200 * i + 20, //Math.random() * viewport.screenWidth,
        y: 100 * i + 20, //Math.random() * viewport.screenHeight,
      },
      id: 'A' + i,
      recipeLabel: translate(recipe) as string,
      recipeName: recipe as string,
      tier: Math.floor(Math.random() * 7),
      overclock: Math.floor(Math.random() * 200),
      machineName: machine as string,
      machineLabel: getBuildingName(machine) as string,
      inputConnections: getInputsForBuilding(machine as string),
      outputConnections: getOutputsForBuilding(machine as string),
    };

    // console.log(nodeData);

    connections.push(nodeData.id);

    const newNode = new AdvancedNode(nodeData);

    initialConnectionsMap.set(nodeData.id, newNode);

    children.push(newNode);
  }

  for (let i = 0; i < connections.length - 1; i++) {
    const from = connections[i];
    const to = connections[i + 1];

    const sourceNode = initialConnectionsMap.get(from)!;
    const targetNode = initialConnectionsMap.get(to)!;

    const edgeProps = {
      id: stringGen(10),
      type: 'cool', // should be fluid type?
      sourceNode,
      targetNode,
    };

    const edge = new SimpleEdge(edgeProps);
    children.unshift(edge);
  }

  const additionalNodes =
    parseInt(urlParams.get('numXtraNodes') || '', 10) || 0;

  console.log('Additional', additionalNodes);

  for (let i = 0; i < additionalNodes; i++) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const machine = machines[Math.floor(Math.random() * machines.length)];

    const nodeData = {
      position: {
        x: 220 * (i + 1), //Math.random() * viewport.screenWidth,
        y: 120 * (i + 1), //Math.random() * viewport.screenHeight,
      },
      id: stringGen(10),
      recipeLabel: translate(recipe) as string,
      recipeName: recipe as string,
      tier: Math.floor(Math.random() * 7),
      overclock: Math.floor(Math.random() * 200),
      machineName: machine as string,
      machineLabel: getBuildingName(machine) as string,
      inputConnections: getInputsForBuilding(machine as string),
      outputConnections: getOutputsForBuilding(machine as string),
    };

    connections.push(nodeData.id);

    const newNode = new AdvancedNode(nodeData);

    initialConnectionsMap.set(nodeData.id, newNode);

    children.push(newNode);
  }

  for (let i = 0; i < additionalNodes; i++) {
    const from = connections[i];
    const to = connections[connections.length - i - 1];

    const sourceNode = initialConnectionsMap.get(from)!;
    const targetNode = initialConnectionsMap.get(to)!;

    const edgeProps = {
      id: stringGen(10),
      type: 'cool', // should be fluid type?
      sourceNode,
      targetNode,
    };

    const edge = new SimpleEdge(edgeProps);
    children.unshift(edge);
  }

  console.timeEnd('loadNodes');

  return children;
};

export default initCanvasChildren;
