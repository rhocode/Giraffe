import memoizedProtoSpecLoader from 'v3/utils/protoUtils';
import { getLatestSchemaName } from 'apps/Graph/libraries/SGLib/utils/getLatestSchema';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./runtime/bruteForceChainGeneration';

const initRuntime = () => {
  memoizedProtoSpecLoader(getLatestSchemaName()).then((data: any) => {
    console.log(data);

    let instance = worker(); // `new` is optional
    instance.bruteForceChainGeneration(data).then((a: any) => {
      console.log(a);
    });
    // generateOrdering(data);
    // bruteForceChainGeneration(data);
  });
};

export default initRuntime;
