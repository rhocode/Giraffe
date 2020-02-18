import gql from 'graphql-tag';
import { urlRepository } from '../apps/GraphV3/libraries/SatisGraphtoryLib/repositories/image';
import gqlClient from './gqlClient';

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

const GET_ALL_RECIPES = gql`
  {
    getRecipes {
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
      machineClass {
        id
        name
      }
      alternate
      time
      hidden
    }
  }
`;

export const getAllRecipes = options => {
  const client = gqlClient();
  return client
    .query({
      query: GET_ALL_RECIPES
    })
    .then(response => {
      // console.log(response.data.getRecipes);
    });
};

getAllRecipes();

export const getCraftingMachineClasses = options => {
  const client = gqlClient();
  const imageBaseUrl = options.useAltImages
    ? urlRepository.machinesAlt
    : urlRepository.machines;
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

const lazyLoadedGetPlaceableMachineClasses = options => {
  const client = gqlClient();
  const imageBaseUrl = options.useAltImages
    ? urlRepository.machinesAlt
    : urlRepository.machines;
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

export const getPlaceableMachineClasses = (() => {
  let query = null;

  return (options = {}) => {
    if (!query) {
      query = lazyLoadedGetPlaceableMachineClasses(options);
    }

    return query;
  };
})();
