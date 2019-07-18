import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import gql from 'graphql-tag';

const queryText = gql`
  query ($className: String, $classId: Int) {
    getRecipeByOutputItemId(item_id: $classId) {
      name
      machineClass {
        name
      }
    }
    
    getRecipes {
      name
      input {
        item {
          name
          icon
        }
        itemQuantity
      }
      output
      machineClass {
        name
      }
      id
    }
  }
`;


//
// getMachineClasses(class_name: $className, class_id: $classId) {
//   name
//   inputs
//   instances {
//     name
//     machineClass {
//       name
//       inputs
//     }
//     tier {
//       name
//     }
//   }
// }
// getMachineClassById(class_id: $classId) {
//   name
//   inputs
// }

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
      cityName: "San Diego",
      className: "AAAAA",
      classId: 26
    }
  })
    .then(data => console.log(data.data))
    .catch(error => console.error(error));
};


export default testGraphQL;