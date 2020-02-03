import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const gqlClient = () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  return new ApolloClient({
    // By default, this client will send queries to the
    //  `/graphql` endpoint on the same host
    // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
    // to a different host
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache({
      addTypename: false
    })
  });
};

export default gqlClient;
