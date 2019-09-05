import schemas from '../generated';
import * as protobuf from 'protobufjs/light';

const root = () => protobuf.Root.fromJSON(schemas['0.1.0']);

const loadDataRaw = () => {
  const memoizedLoadData = {};
  return (filename, mapper) => {
    const key = filename + '-' + mapper.name;
    if (memoizedLoadData[key]) {
      return memoizedLoadData[key];
    } else {
      const ItemList = root().lookupType(filename);
      const promise = fetch(
        `${process.env.PUBLIC_URL}/proto/0.1.0/${filename}.s2`
      )
        .then(data => data.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
        .then(buffer => {
          return ItemList.decode(buffer);
        })
        .then(data => ItemList.toObject(data).data)
        .then(data => mapper(data));
      memoizedLoadData[key] = promise;
      return promise;
    }
  };
};

const loadData = loadDataRaw();

// const iDataMapper = data => {
//   const Item = root().lookupEnum('Item');
//   const map = {};
//   // console.error(Item.valuesById);
//   // const consoleList = [];
//   data.forEach(item => {
//     map[item.id] = item;
//     // consoleList.push([item.id, item.name, Item.valuesById[item.id]]);
//     item.id = Item.valuesById[item.id];
//   });
//   // console.log(JSON.stringify(consoleList, null, 4));
//   return map;
// };
//
// export const itemPromise = loadData('ItemList', iDataMapper);

const mcDataMapper = data => {
  const MachineClass = root().lookupEnum('MachineClass');
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
    item.id = MachineClass.valuesById[item.id];
  });
  return map;
};

export const machineClassListPromise = () =>
  loadData('MachineClassList', mcDataMapper);

const mIDataMapper = data => {
  const MachineClass = root().lookupEnum('MachineClass');
  const UpgradeTiers = root().lookupEnum('UpgradeTiers');
  const map = {};
  data.forEach(item => {
    item.id = MachineClass.valuesById[item.id];
    map[item.id + '_' + UpgradeTiers.values[item.tier]] = item;
  });
  return map;
};

export const machineInstanceListPromise = () =>
  loadData('MachineClassList', mIDataMapper);

const rDataMapper = data => {
  const Recipe = root().lookupEnum('Recipe');
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
    item.id = Recipe.valuesById[item.id];
  });
  return map;
};

export const recipeListPromise = () => loadData('RecipeList', rDataMapper);

// resolvers -> get where on earth id -> get consolidated_weather data and return
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
      const itemEnum = root().lookupEnum('Item').values[args.item_name];
      return recipeListPromise().then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.output || []).some(elem => elem.item === itemEnum);
        });
      });
    },
    getRecipeByInputItemName(obj, args, context, info) {
      const itemEnum = root().lookupEnum('Item').values[args.item_name];
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
      const Item = root().lookupEnum('Item');
      return Item.valuesById[ResourcePacket.item];
    }
  },
  Recipe: {
    machineClass(Recipe) {
      return machineClassListPromise().then(mcMap => {
        return mcMap[Recipe.machineClass];
      });
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
      const UpgradeTiers = root().lookupEnum('UpgradeTiers');
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
      return root().lookupEnum('MachineClass').values[machineClass.id];
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
      const machineClassId = root().lookupEnum('MachineClass').values[
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
      const UpgradeTiers = root().lookupEnum('UpgradeTiers');
      return UpgradeTiers.valuesById[upgradeTier];
    },
    value(upgradeTier) {
      return upgradeTier;
    }
  }
};

export default resolvers;
