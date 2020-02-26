import { protobufRoot } from '../utils/protoUtils';

const machineInstanceListPromise = () => {};
const recipeListPromise = () => {};
const machineClassListPromise = () => {};

const resolvers = {
  Query: {
    getMachineClassByName(obj, args, context, info) {
      return machineClassListPromise().then(mcMap => {
        let values = Object.values(mcMap).filter(value => {
          return value.id === args.class_name;
        });

        if (values.length === 1) {
          return values[0];
        } else if (values.length > 1) {
          throw new Error(
            `Multiple values found for ${args.class_name}: ${JSON.stringify(
              values
            )}`
          );
        }

        return null;
      });
    },
    getMachineClassById(obj, args, context, info) {
      return machineClassListPromise().then(mcMap => {
        return mcMap[args.class_id];
      });
    },
    getCraftingMachineClasses(obj, args, context, info) {
      return recipeListPromise().then(rMap => {
        const acceptedMachineClasses = new Set(
          Object.values(rMap).map(recipe => recipe.machineClass)
        );
        return machineClassListPromise().then(mcMap => {
          return Array.from(acceptedMachineClasses).map(
            classId => mcMap[classId]
          );
        });
      });
    },
    getAllMachineClasses(obj, args, context, info) {
      return machineClassListPromise().then(mcMap => {
        return Array.from(Object.keys(mcMap).map(key => mcMap[key]));
      });
    },
    getMachineClasses(obj, args, context, info) {
      return machineClassListPromise().then(mcMap => {
        const values = Object.values(mcMap);

        return values;
      });
    },
    getRecipes(obj, args, context, info) {
      return recipeListPromise().then(rMap => {
        return Object.values(rMap);
      });
    },
    getRecipeById(obj, args, context, info) {
      return recipeListPromise().then(rMap => {
        return rMap[args.recipe_id];
      });
    },
    getRecipeByOutputItemId(obj, args, context, info) {
      return recipeListPromise().then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.output || []).some(elem => elem.item === args.item_id);
        });
      });
    },
    getRecipeByInputItemId(obj, args, context, info) {
      return recipeListPromise().then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.input || []).some(elem => elem.item === args.item_id);
        });
      });
    },
    getRecipeByOutputItemName(obj, args, context, info) {
      const itemEnum = protobufRoot().lookupEnum('Item').values[args.item_name];
      return recipeListPromise().then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.output || []).some(elem => elem.item === itemEnum);
        });
      });
    },
    getRecipeByInputItemName(obj, args, context, info) {
      const itemEnum = protobufRoot().lookupEnum('Item').values[args.item_name];
      return recipeListPromise().then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.input || []).some(elem => elem.item === itemEnum);
        });
      });
    }
  },
  Item: {
    name(Item) {
      return Item;
    },
    icon(Item) {
      //TODO: deprecate this maybe
      return Item;
    }
  },
  ResourcePacket: {
    item(ResourcePacket) {
      const Item = protobufRoot().lookupEnum('Item');
      return Item.valuesById[ResourcePacket.item];
    }
  },
  Recipe: {
    machineClass(Recipe) {
      return machineClassListPromise().then(mcMap => {
        return mcMap[Recipe.machineClass];
      });
    },
    alternate(Recipe) {
      return Recipe.alternate ?? false;
    },
    input(Recipe) {
      return Recipe.input || [];
    },
    output(Recipe) {
      return Recipe.output || [];
    }
  },
  MachineInstance: {
    icon(MachineInstance) {
      return MachineInstance.icon || MachineInstance.id;
    },
    machineClass(MachineInstance) {
      return machineClassListPromise().then(mcMap => {
        const filteredInstances = Object.values(mcMap).filter(
          machineClassInstance => {
            return machineClassInstance.id === MachineInstance.id;
          }
        );

        if (filteredInstances.length === 1) {
          return filteredInstances[0];
        }

        return null;
      });
    },
    name(MachineInstance) {
      const UpgradeTiers = protobufRoot().lookupEnum('UpgradeTiers');
      if (UpgradeTiers.valuesById[MachineInstance.tier] === 'NA') {
        return MachineInstance.id;
      }
      return (
        MachineInstance.id + '_' + UpgradeTiers.valuesById[MachineInstance.tier]
      );
    }
  },
  MachineClass: {
    id(machineClass) {
      return protobufRoot().lookupEnum('MachineClass').values[machineClass.id];
    },
    inputs(machineClass) {
      return machineClass.inputs;
    },
    outputs(machineClass) {
      return machineClass.outputs;
    },
    icon(machineClass) {
      if (machineClass.icon) {
        return machineClass.icon;
      }
      return machineInstanceListPromise().then(mcMap => {
        const upgrades = Object.values(mcMap).filter(machineClassInstance => {
          return machineClassInstance.id === machineClass.id;
        });
        return upgrades[0].id;
      });
    },
    recipes(machineClass) {
      const machineClassId = protobufRoot().lookupEnum('MachineClass').values[
        machineClass.id
      ];
      return recipeListPromise().then(rMap => {
        const recipes = Object.keys(rMap).filter(recipeKey => {
          const recipe = rMap[recipeKey];
          return recipe.machineClass === machineClassId;
        });

        return recipes.map(key => rMap[key]);
      });
    },
    instances(machineClass) {
      return machineInstanceListPromise().then(mcMap => {
        return Object.values(mcMap)
          .filter(machineClassInstance => {
            return machineClassInstance.id === machineClass.id;
          })
          .sort((m1, m2) => {
            return m1.tier - m2.tier;
          });
      });
    },
    hasUpgrades(machineClass) {
      return machineInstanceListPromise().then(mcMap => {
        const instances = Object.values(mcMap).filter(machineClassInstance => {
          return machineClassInstance.id === machineClass.id;
        });

        return instances.length > 1;
      });
    },
    tiers(machineClass) {
      return machineInstanceListPromise().then(mcMap => {
        return Object.values(mcMap)
          .filter(machineClassInstance => {
            return machineClassInstance.id === machineClass.id;
          })
          .sort((m1, m2) => {
            return m1.tier - m2.tier;
          })
          .map(item => item.tier);
      });
    }
  },
  UpgradeTier: {
    name(upgradeTier) {
      const UpgradeTiers = protobufRoot().lookupEnum('UpgradeTiers');
      return UpgradeTiers.valuesById[upgradeTier];
    },
    value(upgradeTier) {
      return upgradeTier;
    }
  }
};

export default resolvers;
