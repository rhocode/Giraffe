import generatedTypeDefs from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/graphql/generatedTypeDefs';

const selfTypes = `
    
`;

const queries = `
  type Query {
    getRecipesByMachine: [Recipe]
  }
`;

const typeDefs = [generatedTypeDefs, selfTypes, queries].join('\n');

export default typeDefs;
