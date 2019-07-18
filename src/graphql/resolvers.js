import schemas from "../generated";

const protobuf = require("protobufjs/light");

const root = protobuf.Root.fromJSON(schemas["0.1.0"]);

const loadData = (filename, mapper) => {
  const ItemList = root.lookupType(filename);
  return fetch(`${process.env.PUBLIC_URL}/proto/0.1.0/${filename}.s2`).then(data => data.arrayBuffer())
    .then(buffer => new Uint8Array(buffer)).then((buffer) => {
      return ItemList.decode(buffer);
    }).then(data => ItemList.toObject(data).data).then(data => mapper(data))
};

const iDataMapper = (data) => {
  const Item = root.lookupEnum("Item");
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
    item.id = Item.valuesById[item.id];
  });
  return map;
};

const itemListPromise = loadData("ItemList", iDataMapper);

const mcDataMapper = (data) => {
  const MachineClass = root.lookupEnum("MachineClass");
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
    item.id = MachineClass.valuesById[item.id];
  });
  return map;
};

const machineClassListPromise = loadData("MachineClassList",   mcDataMapper);

const mIDataMapper = (data) => {
  const MachineClass = root.lookupEnum("MachineClass");
  const map = {};
  data.forEach(item => {
    item.id = MachineClass.valuesById[item.id];
    map[item.id + '_' + item.tier] = item;
  });
  return map;
};

const machineInstanceListPromise = loadData("MachineClassList",   mIDataMapper);

const rDataMapper = (data) => {
  const Recipe = root.lookupEnum("Recipe");
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
    item.id = Recipe.valuesById[item.id];
  });
  return map;
};

const recipeListPromise = loadData("RecipeList", rDataMapper);

// resolvers -> get where on earth id -> get consolidated_weather data and return
const resolvers = {
  Query: {
    getMachineClassByName(obj, args, context, info) {
      return machineClassListPromise.then(mcMap => {
        let values = Object.values(mcMap).filter(value => {
          return value.id === args.class_name
        });

        if (values.length === 1) {
          return values[0];
        } else if (values.length > 1) {
          throw new Error(`Multiple values found for ${args.class_name}: ${JSON.stringify(values)}`);
        }

        return null;
      });
    },
    getMachineClassById(obj, args, context, info) {
      return machineClassListPromise.then(mcMap => {
        return mcMap[args.class_id];
      });
    },
    getMachineClasses(obj, args, context, info) {
      return machineClassListPromise.then(mcMap => {
        const values = Object.values(mcMap);

        return values;
      });
    },
    getRecipes(obj, args, context, info) {
      return recipeListPromise.then(rMap => {
        const values = Object.values(rMap);
        return values;
      });
    },
    getRecipeById(obj, args, context, info) {
      return recipeListPromise.then(rMap => {
        return rMap[args.recipe_id];
      });
    },
    getRecipeByOutputItemId(obj, args, context, info) {
      return recipeListPromise.then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.output || []).some(elem => elem.item === args.item_id);
        })
      });
    },
    getRecipeByInputItemId(obj, args, context, info) {
      return recipeListPromise.then(rMap => {
        return Object.values(rMap).filter(recipe => {
          return (recipe.input || []).some(elem => elem.item === args.item_id);
        })
      });
    }
  },
  Item: {
    name(Item) {
      return Item.name;
    },
    icon(Item) {
      return Item.icon || (Item.name + '.png');
    }
  },
  ResourcePacket: {
    item(ResourcePacket) {
      return itemListPromise.then(itemMap => itemMap[ResourcePacket.item]);
    }
  },
  Recipe: {
    machineClass(Recipe) {
      return machineClassListPromise.then(mcMap => {
        return mcMap[Recipe.machineClass]
      })
    }
  },
  MachineInstance: {
    icon(MachineInstance) {
      return MachineInstance.icon || (MachineInstance.name + '.png');
    },
    machineClass(MachineInstance) {
      return machineClassListPromise.then(mcMap => {
        const filteredInstances = Object.values(mcMap).filter(machineClassInstance => {
          return machineClassInstance.id === MachineInstance.id
        });

        if (filteredInstances) {
          return filteredInstances[0]
        }

        return null;
      });
    },
    name(MachineInstance) {
      const UpgradeTiers = root.lookupEnum("UpgragtdeTiers");
      if (UpgradeTiers.valuesById[MachineInstance.tier] === 'NA') {
        return  MachineInstance.id;
      }
      return MachineInstance.id + '_' + UpgradeTiers.valuesById[MachineInstance.tier];
    }
  },
  MachineClass: {
    icon(machineClass) {
      return machineClass.icon || (machineClass.name + '.png');
    },
    instances(machineClass) {
      return machineInstanceListPromise.then(mcMap => {
        return Object.values(mcMap).filter(machineClassInstance => {
          return machineClassInstance.id === machineClass.id
        })
      });
    }
  },
  UpgradeTier: {
    name(upgradeTier) {
      const UpgradeTiers = root.lookupEnum("UpgradeTiers");
      return UpgradeTiers.valuesById[upgradeTier];
    },
    value(upgradeTier) {
      return upgradeTier
    }
  }
};

export default resolvers;