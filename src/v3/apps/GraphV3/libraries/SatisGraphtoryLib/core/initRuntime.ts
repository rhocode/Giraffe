// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./deprecatedRuntime/bruteForceChainGeneration';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import { getBuildableMachineClassNames } from 'v3/data/loaders/buildings';
import {
  getExtractorRecipes,
  getMachineCraftableRecipeList,
} from 'v3/data/loaders/recipes';
import { kiwiSolver } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/solver';
import { getRecipeGraph } from 'v3/data/graph/recipeGraph';

const initRuntime = () => {
  // graphAppStore.update(s => {
  //   s.placeableMachineClasses = getBuildableMachineClassNames();
  // });
  //
  // getExtractorRecipes();
  kiwiSolver();
};

export default initRuntime;
