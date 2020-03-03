import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/graphql/typeDefs';
import resolvers from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/graphql/resolvers';

const gqlClient = () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache({
      addTypename: false
    })
  });
};

export default gqlClient;
