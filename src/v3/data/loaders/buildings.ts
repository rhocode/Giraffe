import lazyFunc from 'v3/utils/lazyFunc';
import ConnectionsJson from 'data/Connections.json';
import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import imageRepo from 'data/images/__all';
import RecipeJson from 'data/Recipes.json';
import Connections from 'data/Connections.json';
import memoize from 'fast-memoize';
import { EResourceForm } from '.data-landing/interfaces/enums';

const slugToCustomMachineGroup = (slug: string) => {
  switch(slug) {
    case 'building-conveyor-attachment-merger':
    case 'building-conveyor-attachment-splitter':
    case 'building-pipeline-junction-cross':
      return 'machine-group-logistics'
    case 'building-pipe-storage-tank':
    case 'building-industrial-tank':
      return 'machine-group-liquid-storage'
    case 'building-storage-container':
      return 'machine-group-item-storage'
  }

  return slug;
}

const getBuildableMachinesFn = () => {
  const buildables = new Set(Object.keys(ConnectionsJson));

  const machineByType = new Map<string, any[]>();

  Object.entries(BuildingJson)
    .filter(([key]) => {
      return buildables.has(key);
    })
    .forEach(([slug, value]) => {
      if (!machineByType.get(value.buildingType)) {
        machineByType.set(value.buildingType, []);
      }

      machineByType.get(value.buildingType)!.push(slug);
    });

  for (const value of machineByType.values()) {
    value.sort();
  }

  machineByType.delete('ITEMPASSTHROUGH');
  machineByType.delete('FLUIDPASSTHROUGH');
  machineByType.delete('TRUCKSTATION');
  machineByType.delete('TRAINSTATION');
  machineByType.delete('GENERATOR');
  machineByType.delete('SINK');

  // Stub the FLOWMANIPULATOR CLASS for now
  machineByType.set('ITEMFLOWMANIPULATOR', [
    'building-conveyor-attachment-merger',
    'building-conveyor-attachment-splitter',
  ]);

  const allMachines: string[] = [...machineByType.values()].flat(1);
  const machineClassMap = new Map<string, string[]>();
  const machineClassImageMap = new Map<string, string>();

  allMachines.forEach((machine) => {
    const markRegex = /^(.*)-mk[0-9]+(-.*)?$/;
    if (markRegex.test(machine)) {
      const regexResult = markRegex.exec(machine);
      const slug = `${regexResult![1] + (regexResult![2] || '')}`;

      const resolvedSlug = slugToCustomMachineGroup(slug);

      if (!machineClassMap.get(resolvedSlug)) {
        machineClassMap.set(resolvedSlug, []);
      }
      machineClassMap.get(resolvedSlug)!.push(machine);
    } else {
      const resolvedSlug = slugToCustomMachineGroup(machine);
      if (!machineClassMap.get(resolvedSlug)) {
        machineClassMap.set(resolvedSlug, []);
      }
      machineClassMap.get(resolvedSlug)!.push(machine);
    }
  });

  const machineClassReverseMap = new Map<string, string>();

  for (const entry of machineClassMap.entries()) {
    const [key, value] = entry;
    value.sort();
    machineClassImageMap.set(key, value[0]);
    value.forEach((className) => {
      machineClassReverseMap.set(className, key);
    });
  }

  //TODO: make this into a better system to allow for placing machines easier. The above is mostly cruft to remove
  // the buildables we don't want to show.
  return {
    machineClassMap,
    machineClassImageMap,
    machineClassReverseMap,
  };
};

const getBuildableMachinesByClass = memoize(getBuildableMachinesFn);

export const getBuildableMachineClassNames = lazyFunc(() => {
  return [...getBuildableMachinesByClass().machineClassMap.keys()];
});

export const getBuildableMachinesFromClassName = (() => {
  const classListMap = getBuildableMachinesByClass().machineClassMap;
  return (name: string) => {
    return classListMap.get(name);
  };
})();

export const getClassNameFromBuildableMachines = (() => {
  const reverseClassListMap = getBuildableMachinesByClass()
    .machineClassReverseMap;
  return (name: string) => {
    return reverseClassListMap.get(name);
  };
})();

const getAllBuildableMachinesFn = () => {
  const classListMap = getBuildableMachinesByClass().machineClassMap;
  return [...classListMap.values()].flat();
};

export const getAllBuildableMachines = memoize(getAllBuildableMachinesFn);

export const getBuildableMachineClassIcon = (() => {
  const classImageMap = getBuildableMachinesByClass().machineClassImageMap;
  return (name: string) => {
    return classImageMap.get(name);
  };
})();

export const getBuildingName = (slug: string) => {
  return (BuildingJson as any)[slug].name;
};

export const getBuildingImageName = (slug: string) => {
  const itemSlug = slug.replace(/^building/g, 'item');

  return (ItemJson as any)[itemSlug].icon;
};

export const getBuildingIcon = (slug: string, size: number) => {
  const itemSlug = slug.replace(/^building/g, 'item');
  return (imageRepo as any)[
    `sg${getBuildingImageName(itemSlug)}_${size}`.replace(/-/g, '_')
  ];
};

export const getRecipesByMachineClass = (machineClass: string) => {
  const machineClasses = new Set(
    getBuildableMachinesFromClassName(machineClass) || []
  );
  const entries = Object.entries(RecipeJson).filter(([slug, recipe]) => {
    return recipe.producedIn.some((element) => machineClasses.has(element));
  });

  const obj = {} as any;
  Object.keys(RecipeJson).forEach((key: string) => {
    obj[key] = (RecipeJson as any)[key].name;
  });
  // console.log(JSON.stringify(obj, null, 2));
  return entries;
};

export const getBuildingsByType = (type: string) => {
  return Object.entries(BuildingJson)
    .filter(([key, value]) => {
      return value.buildingType === type;
    })
    .map(([key]) => key);
};

export const getBuildingDefinition = (buildingSlug: string) => {
  return (BuildingJson as any)[buildingSlug];
};

export const getNumOutputsForBuilding = (
  buildingSlug: string,
  resourceForm: EResourceForm
) => {
  switch (resourceForm) {
    case EResourceForm.RF_SOLID:
      return (Connections as any)[buildingSlug].outputBelts || 0;
    case EResourceForm.RF_LIQUID:
      return (Connections as any)[buildingSlug].outputPipes || 0;
    default:
      throw new Error('Invalid resourceForm for building ' + resourceForm);
  }
};

export const getNumInputsForBuilding = (
  buildingSlug: string,
  resourceForm: EResourceForm
) => {
  switch (resourceForm) {
    case EResourceForm.RF_SOLID:
      return (Connections as any)[buildingSlug].inputBelts || 0;
    case EResourceForm.RF_LIQUID:
      return (Connections as any)[buildingSlug].inputPipes || 0;
    default:
      throw new Error('Invalid resourceForm for building ' + resourceForm);
  }
};
