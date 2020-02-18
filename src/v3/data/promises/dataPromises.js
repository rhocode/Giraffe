import lazyFunc from '../../utils/lazyFunc';
import { loadProtoData, protobufRoot } from '../../utils/protoUtils';

export const machineClassListPromise = lazyFunc(() =>
  loadProtoData('MachineClassList', data => {
    const MachineClass = protobufRoot().lookupEnum('MachineClass');
    const map = {};
    data.forEach(item => {
      map[item.id] = item;
      item.id = MachineClass.valuesById[item.id];
    });

    return map;
  })
);

export const machineInstanceListPromise = lazyFunc(() =>
  loadProtoData('MachineClassList', data => {
    const MachineClass = protobufRoot().lookupEnum('MachineClass');
    const UpgradeTiers = protobufRoot().lookupEnum('UpgradeTiers');
    const map = {};
    data.forEach(item => {
      item.id = MachineClass.valuesById[item.id];
      map[item.id + '_' + UpgradeTiers.values[item.tier]] = item;
    });
    console.error(map);
    return map;
  })
);

export const recipeListPromise = lazyFunc(() =>
  loadProtoData('RecipeList', data => {
    const Recipe = protobufRoot().lookupEnum('Recipe');
    const map = {};
    data.forEach(item => {
      map[item.id] = item;
      item.id = Recipe.valuesById[item.id];
    });
    return map;
  })
);
