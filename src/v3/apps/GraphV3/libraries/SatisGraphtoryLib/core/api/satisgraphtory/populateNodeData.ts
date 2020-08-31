import stringGen from 'v3/utils/stringGen';
import { getBuildingName } from 'v3/data/loaders/buildings';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';

const populateNodeData = (
  buildingSlug: string,
  recipe: string | null,
  overclock: number,
  x: number,
  y: number,
  translateFunction: (arg0: string) => string
) => {
  return new AdvancedNode({
    position: {
      x: x - Math.floor(NODE_WIDTH / 2),
      y: y - Math.floor(NODE_HEIGHT / 2),
    },
    id: stringGen(10),
    recipeLabel: recipe ? translateFunction(recipe) : '',
    recipeName: recipe ? recipe : '',
    tier: 1, //todo: figure out how to properly get the tier here
    overclock,
    machineName: buildingSlug,
    machineLabel: getBuildingName(buildingSlug) as string,
    inputs: [null], // TODO: figure out how to mark inputs and outputs as
    outputs: [null],
  });
};

export default populateNodeData;
