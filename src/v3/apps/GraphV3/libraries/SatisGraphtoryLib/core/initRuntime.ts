// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./runtime/bruteForceChainGeneration';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';
import { getBuildableMachineClassNames } from 'v3/data/loaders/buildings';
import { getExtractorRecipes } from 'v3/data/loaders/recipes';

const initRuntime = () => {
  graphAppStore.update(s => {
    s.placeableMachineClasses = getBuildableMachineClassNames();
  });

  getExtractorRecipes();
};

export default initRuntime;
