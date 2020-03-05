import memoizedProtoSpecLoader from 'v3/utils/protoUtils';
import { getLatestSchemaName } from 'apps/Graph/libraries/SGLib/utils/getLatestSchema';
import generateOrdering from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/runtime/recipeTopology';
import bruteForceChainGeneration from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/runtime/bruteForceChainGeneration';

const initRuntime = () => {
  memoizedProtoSpecLoader(getLatestSchemaName()).then((data: any) => {
    console.log(data);

    // generateOrdering(data);
    bruteForceChainGeneration(data);
  });
};

export default initRuntime;
