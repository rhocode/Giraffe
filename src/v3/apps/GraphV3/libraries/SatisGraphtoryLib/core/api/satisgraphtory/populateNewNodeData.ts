import uuidGen from 'v3/utils/stringUtils';
import {
  getAnyConnectionsForBuilding,
  getBuildingName,
  getInputsForBuilding,
  getOutputsForBuilding,
  getTier,
} from 'v3/data/loaders/buildings';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';

const populateNewNodeData = (
  buildingSlug: string,
  recipe: string | null,
  overclock: number,
  x: number,
  y: number,
  translateFunction: (arg0: string) => string,
  theme: any
) => {
  return new AdvancedNode({
    position: {
      x: x - Math.floor(NODE_WIDTH / 2),
      y: y - Math.floor(NODE_HEIGHT / 2),
    },
    id: uuidGen(),
    recipeLabel: recipe ? translateFunction(recipe) : '',
    recipeName: recipe ? recipe : '',
    tier: getTier(buildingSlug),
    overclock,
    machineName: buildingSlug,
    machineLabel: getBuildingName(buildingSlug) as string,
    inputConnections: getInputsForBuilding(buildingSlug, theme),
    outputConnections: getOutputsForBuilding(buildingSlug, theme),
    anyConnections: getAnyConnectionsForBuilding(buildingSlug, theme),
    theme,
  });
};

export default populateNewNodeData;
