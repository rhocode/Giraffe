import gql from 'graphql-tag';
import { getClient } from '../../../graphql';
import { urlRepository } from '../libraries/SGLib/repositories/imageRepository';

const GET_CRAFTING_MACHINE_CLASSES = gql`
  {
    getCraftingMachineClasses {
      name
      icon
      hasUpgrades
      id
      inputs
      outputs
      tiers {
        name
      }
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

const GET_ALL_MACHINE_CLASSES = gql`
  {
    getAllMachineClasses {
      name
      icon
      hasUpgrades
      id
      inputs
      outputs
      tiers {
        name
      }
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
          const tiers = machine.tiers.length;
          let icon = imageBaseUrl[machine.icon];
          if (tiers === 0) {
            if (!icon) {
              console.error('Missing file ' + machine.icon);
              icon = imageBaseUrl['miner_mk1'];
            }
          } else {
            const tierName = machine.tiers[0].name;
            const baseName = machine.name;
            const baseNameWithTier = machine.name + '_' + tierName;
            const name = baseName || 'miner_mk1';

            const tieredChoice = imageBaseUrl[baseNameWithTier];
            const baseChoice = imageBaseUrl[name];

            if (tieredChoice) {
              icon = tieredChoice;
            } else if (baseChoice) {
              icon = baseChoice;
            } else {
              console.error('Missing file ' + machine.icon);
              icon = imageBaseUrl['miner_mk1'];
            }
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

export const getPlaceableMachineClasses = (alt = false) => {
  const client = getClient();
  const imageBaseUrl = alt ? urlRepository.machinesAlt : urlRepository.machines;
  return client
    .query({
      query: GET_ALL_MACHINE_CLASSES
    })
    .then(response => {
      return response.data.getAllMachineClasses
        .sort((machine1, machine2) => {
          return machine1.name.localeCompare(machine2.name);
        })
        .map(machine => {
          const tiers = machine.tiers.length;
          let icon = imageBaseUrl[machine.icon];
          if (tiers === 0) {
            if (!icon) {
              console.error('Missing file ' + machine.icon);
              icon = imageBaseUrl['miner_mk1'];
            }
          } else {
            const tierName = machine.tiers[0].name;
            const baseName = machine.name;
            const baseNameWithTier = machine.name + '_' + tierName;
            const name = baseName || 'miner_mk1';

            const tieredChoice = imageBaseUrl[baseNameWithTier];
            const baseChoice = imageBaseUrl[name];

            if (tieredChoice) {
              icon = tieredChoice;
            } else if (baseChoice) {
              icon = baseChoice;
            } else {
              console.error('Missing file ' + machine.icon);
              icon = imageBaseUrl['miner_mk1'];
            }
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
