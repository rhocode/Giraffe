import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import gql from 'graphql-tag';

const queryText2 = gql`
  query ($cityName: String!){
    cityWeather (city_name: $cityName) {
      temp
      max_temp
      min_temp
    }
  }
`;


const queryText = gql`
  query ($cityName: String!){
    getMachineClasses {
      name
      inputs
      instances {
        name
        tier {
          name
        }
      }
    }
  }
`;

const getClient = () => {
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

const testGraphQL = () => {
  const client = getClient();
  client.query({
    query: queryText,
    variables: {
      cityName: "San Diego"
    }
  })
    .then(data => console.log(data.data))
    .catch(error => console.error(error));
};

export default testGraphQL;