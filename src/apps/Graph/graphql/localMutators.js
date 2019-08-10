import gql from 'graphql-tag';
import { getClient } from '../../../graphql';
import { urlRepository } from '../libraries/SGLib/repositories/imageRepository';

const GET_MACHINE_NODE_DATA = gql`
  query($className: String) {
    getMachineClassByName(class_name: $className) {
      name
      icon
      instances {
        tier {
          name
          value
        }
      }
    }
  }
`;

export const getMachineClass = className => {
  const client = getClient();
  return client
    .query({
      query: GET_MACHINE_NODE_DATA,
      variables: {
        className
      }
    })
    .then(response => response.data.getMachineClassByName)
    .catch(error => console.error(error));
};
