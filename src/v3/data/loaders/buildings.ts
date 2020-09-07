import lazyFunc from 'v3/utils/lazyFunc';
import ConnectionsJson from 'data/Connections.json';
import Connections from 'data/Connections.json';
import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import imageRepo from 'data/images/__all';
import RecipeJson from 'data/Recipes.json';
import memoize from 'fast-memoize';
import { EResourceForm } from '.data-landing/interfaces/enums';
import stringGen from 'v3/utils/stringGen';
import EdgeTemplate, {
  EdgeAttachmentSide,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { EmptyEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EmptyEdge';

const slugToCustomMachineGroup = (slug: string) => {
  switch (slug) {
    case 'building-conveyor-attachment-merger':
    case 'building-conveyor-attachment-splitter':
    case 'building-pipeline-junction-cross':
      return 'machine-group-logistics';
    case 'building-pipe-storage-tank':
    case 'building-industrial-tank':
      return 'machine-group-liquid-storage';
    case 'building-storage-container':
      return 'machine-group-item-storage';
  }

  return slug;
};

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
  const upgradePathMap = new Map<string, string[]>();
  const reverseUpgradePathMap = new Map<string, string>();

  allMachines.forEach((machine) => {
    const markRegex = /^(.*)-mk[0-9]+(-.*)?$/;
    if (markRegex.test(machine)) {
      const regexResult = markRegex.exec(machine);
      const slug = `${regexResult![1] + (regexResult![2] || '')}`;

      const resolvedSlug = slugToCustomMachineGroup(slug);

      if (!machineClassMap.get(resolvedSlug)) {
        machineClassMap.set(resolvedSlug, []);
      }

      if (!upgradePathMap.get(slug)) {
        upgradePathMap.set(slug, []);
      }
      machineClassMap.get(resolvedSlug)!.push(machine);
      upgradePathMap.get(slug)!.push(machine);
      upgradePathMap.get(slug)!.sort();
      reverseUpgradePathMap.set(machine, slug);
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
    upgradePathMap,
    reverseUpgradePathMap,
  };
};

const getBuildableMachinesByClass = memoize(getBuildableMachinesFn);

export const getBuildableMachineClassNames = lazyFunc(() => {
  return [...getBuildableMachinesByClass().machineClassMap.keys()];
});

const getBuildableMachinesFromClassNameFn = (name: string) => {
  return getBuildableMachinesByClass().machineClassMap.get(name);
};

export const getBuildableMachinesFromClassName = memoize(
  getBuildableMachinesFromClassNameFn
);

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

export const getTier = (buildingSlug: string) => {
  const base = getBuildableMachinesByClass();
  const map = base.reverseUpgradePathMap;
  if (map.get(buildingSlug)) {
    const mainClass = map.get(buildingSlug)!;
    return base.upgradePathMap.get(mainClass)!.indexOf(buildingSlug) + 1;
  } else {
    return 0;
  }
};

export const getOutputsForBuilding = (buildingSlug: string) => {
  const building = (Connections as any)[buildingSlug];
  const outputObject: EdgeTemplate[] = [];
  for (let i = 0; i < building.outputBelts || 0; i++) {
    outputObject.push(
      new EmptyEdge({
        resourceForm: EResourceForm.RF_SOLID,
        id: stringGen(10),
      })
    );
  }

  for (let i = 0; i < building.outputPipes || 0; i++) {
    outputObject.push(
      new EmptyEdge({
        resourceForm: EResourceForm.RF_LIQUID,
        id: stringGen(10),
      })
    );
  }

  return outputObject;
};

export const getInputsForBuilding = (buildingSlug: string) => {
  const building = (Connections as any)[buildingSlug];
  const outputObject: EdgeTemplate[] = [];
  for (let i = 0; i < building.inputBelts || 0; i++) {
    outputObject.push(
      new EmptyEdge({
        resourceForm: EResourceForm.RF_SOLID,
        id: stringGen(10),
      })
    );
  }

  for (let i = 0; i < building.inputPipes || 0; i++) {
    outputObject.push(
      new EmptyEdge({
        resourceForm: EResourceForm.RF_LIQUID,
        id: stringGen(10),
      })
    );
  }

  return outputObject;
};

export const getAnyConnectionsForBuilding = (buildingSlug: string) => {
  const building = (Connections as any)[buildingSlug];
  const outputObject: EdgeTemplate[] = [];

  let sides: EdgeAttachmentSide[] = [];

  switch (building.anyPipes) {
    case 4:
      sides.push(
        EdgeAttachmentSide.TOP,
        EdgeAttachmentSide.RIGHT,
        EdgeAttachmentSide.BOTTOM,
        EdgeAttachmentSide.LEFT
      );
      break;
    case 3:
      sides.push(
        EdgeAttachmentSide.RIGHT,
        EdgeAttachmentSide.BOTTOM,
        EdgeAttachmentSide.LEFT
      );
      break;
    case 2:
      sides.push(EdgeAttachmentSide.RIGHT, EdgeAttachmentSide.LEFT);
      break;
    case 1:
      sides.push(EdgeAttachmentSide.LEFT);
      break;
    default:
      for (let i = 0; i < building.anyPipes || 0; i++) {
        outputObject.push(
          new EmptyEdge({
            resourceForm: EResourceForm.RF_LIQUID,
            id: stringGen(10),
            biDirectional: true,
          })
        );
      }
      return outputObject;
  }

  for (let i = 0; i < building.anyPipes || 0; i++) {
    outputObject.push(
      new EmptyEdge({
        resourceForm: EResourceForm.RF_LIQUID,
        id: stringGen(10),
        biDirectional: true,
        sourceNodeAttachmentSide: sides[i],
      })
    );
  }

  return outputObject;
};
