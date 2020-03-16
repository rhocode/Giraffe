import memoizedProtoSpecLoader from 'v3/utils/protoUtils';
import { getLatestSchemaName } from 'apps/Graph/libraries/SGLib/utils/getLatestSchema';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./runtime/bruteForceChainGeneration';
import {kiwiSolver} from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/runtime/kiwiSolver";

import rawEntities from './runtime/a.json';
import rawRecipes from './runtime/b.json';
import {solveFor} from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/runtime/solveFor";

const entities = rawEntities as any;
const recipes = rawRecipes as any;


const initRuntime = () => {
  memoizedProtoSpecLoader(getLatestSchemaName()).then((data: any) => {

    // const result = solveFor(recipes, entities, {
    //   targets: [{ slug: 'adaptive-control-unit', perMinute: 60 }],
    //   constraints: [],
    // });
    // // //
    // console.log(result);
    // console.log(data);
    //
    // let instance = worker(); // `new` is optional
    // instance.bruteForceChainGeneration(data).then((a: any) => {
    //   console.log(a);
    // });
    // generateOrdering(data);
    // bruteForceChainGeneration(data);


    kiwiSolver(data);
  });
};

export default initRuntime;
