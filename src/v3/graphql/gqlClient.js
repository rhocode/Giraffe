import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema } from 'graphql-tools';

const gqlClient = (typeDefs, resolvers) => {
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
