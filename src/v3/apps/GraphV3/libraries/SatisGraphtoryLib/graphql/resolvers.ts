// import memoizedProtoSpecLoader from 'v3/utils/protoUtils';
// import { getLatestSchemaName } from 'apps/Graph/libraries/SGLib/utils/getLatestSchema';

// const latestSchema = memoizedProtoSpecLoader(getLatestSchemaName());

const resolvers = {
  Query: {
    getRecipesByMachine(obj: any, args: any, context: any, info: any): any {}
  },
  Recipe: {}
};

export default resolvers;
