import gql from 'graphql-tag';
import { getClient } from '../../../graphql';
import { urlRepository } from '../libraries/SGLib/repositories/imageRepository';

const GET_CRAFTING_MACHINE_CLASSES = gql`
  {
    getCraftingMachineClasses {
      name
      icon
      hasUpgrades
      recipes {
        id
        name
        input {
          item {
            name
          }
          itemQuantity
        }
        output {
          item {
            name
          }
          itemQuantity
        }
      }
      instances {
        tier {
          name
          value
        }
      }
    }
  }
`;

export const getCraftingMachineClasses = (alt = false) => {
  const client = getClient();
  const imageBaseUrl = alt ? urlRepository.machinesAlt : urlRepository.machines;
  return client
    .query({
      query: GET_CRAFTING_MACHINE_CLASSES
    })
    .then(response => {
      return response.data.getCraftingMachineClasses
        .sort((machine1, machine2) => {
          return machine1.name.localeCompare(machine2.name);
        })
        .map(machine => {
          let icon = imageBaseUrl[machine.icon];
          if (!icon) {
            console.error('Missing file ' + machine.icon);
            icon = imageBaseUrl[Object.keys(imageBaseUrl)[0]];
          }

          return {
            ...machine,
            name: machine.name,
            icon: icon
          };
        });
    })
    .catch(error => console.error(error));
};
