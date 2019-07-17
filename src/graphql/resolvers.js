import schemas from "../generated";

const METAWEATHER_API_URL = "http://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/";

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
    map[item.id + '_' + item.tier] = item;
    item.id = MachineClass.valuesById[item.id];
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

const getWeather = (data) => {
  return fetch(METAWEATHER_API_URL + data.woeid)
    .then(response => response.json())
};

// get woeid (where on earth id) using city name
const getWoeid = (place) => {
  return fetch(`${METAWEATHER_API_URL}search/?query=${place}`)
    .then(response => response.json())
    .then(response => {
      console.error(response);
      return response;
    })
    .then(jsonResponse => jsonResponse[0])
};

// resolvers -> get where on earth id -> get consolidated_weather data and return
const resolvers = {
  Query: {
    getMachineClasses(obj, args, context, info) {
      return machineClassListPromise.then(mcMap => {
        const keys = Object.keys(mcMap);
        return keys.map(key => {
          return mcMap[key];
        })
      });
    }
  },
  MachineInstance: {
    machineClass(MachineInstance) {
      return machineClassListPromise.then(mcMap => {
        const keys = Object.keys(mcMap);
        const filteredInstances = keys.map(key => {
          return mcMap[key];
        }).filter(machineClassInstance => {
          return machineClassInstance.id === MachineInstance.id
        });

        if (filteredInstances) {
          return filteredInstances[0]
        }

        return null;
      });
    },
    name(MachineInstance) {
      const UpgradeTiers = root.lookupEnum("UpgradeTiers");
      if (UpgradeTiers.valuesById[MachineInstance.tier] === 'NA') {
        return  MachineInstance.id;
      }
      return MachineInstance.id + '_' + UpgradeTiers.valuesById[MachineInstance.tier];
    }
  },
  MachineClass: {
    instances(machineClass) {
      return machineInstanceListPromise.then(mcMap => {
        const keys = Object.keys(mcMap);
        return keys.map(key => {
          return mcMap[key];
        }).filter(machineClassInstance => {
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