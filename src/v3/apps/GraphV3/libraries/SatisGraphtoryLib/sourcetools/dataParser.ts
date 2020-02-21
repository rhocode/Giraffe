import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';
import ExtractorMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/extractorMachine';
import { RF_EMPTY } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import { toProtoBufFromGeneratedEnum } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import ManufacturerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/manufacturerMachine';
import StorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/storageMachine';
import SolidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/solidStorageMachine';
import FluidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/fluidStorageMachine';
import BeltAttachmentMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/beltAttachmentMachine';
import Recipe from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/recipe';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';

const parseList = (list: string) => {
  let parsedList = list.replace(/\(/g, '[');
  parsedList = parsedList.replace(/\)\s/g, '], ');
  parsedList = parsedList.replace(/\)/g, ']');
  parsedList = parsedList.replace(/\s+/, ', ');
  parsedList = parsedList.replace(/[^[\],\s]+/g, '"$&"');
  parsedList = parsedList.replace(/" /g, '", ');

  return JSON.parse(parsedList);
};

const parseLastDir = (str: string) => {
  return str.split('/').slice(-1)[0];
};

const parseParameter = (str: string) => {
  return str.split('.').slice(-1)[0];
};

const getRelevantData = (data: any) => {
  const relevantData: Map<string, Array<string>> = new Map();
  console.log(data);
  data.forEach((row: any) => {
    if (
      row.NativeClass.startsWith("Class'/Script/FactoryGame.FGItemDescriptor")
    ) {
      if (!relevantData.has('items')) {
        relevantData.set('items', []);
      }
      relevantData.get('items')!.push(...row.Classes);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableAttachment"
      )
    ) {
      if (!relevantData.has('beltAttachments')) {
        relevantData.set('beltAttachments', []);
      }
      relevantData.get('beltAttachments')!.push(...row.Classes);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableSplitter"
      )
    ) {
      if (!relevantData.has('beltAttachments')) {
        relevantData.set('beltAttachments', []);
      }
      relevantData.get('beltAttachments')!.push(...row.Classes);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableGenerator"
      )
    ) {
      if (!relevantData.has('generators')) {
        relevantData.set('generators', []);
      }
      relevantData.get('generators')!.push(...row.Classes);
    }

    if (
      row.NativeClass ===
      "Class'/Script/FactoryGame.FGBuildableResourceExtractor'"
    ) {
      relevantData.set('extractors', row.Classes);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildableManufacturer'"
    ) {
      relevantData.set('manufacturers', row.Classes);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildableConveyorBelt'"
    ) {
      relevantData.set('belts', row.Classes);
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGRecipe'") {
      relevantData.set('recipes', row.Classes);
    }

    // if (row.NativeClass === "Class'/Script/FactoryGame.FGBuildingDescriptor'") {
    //   relevantData.buildings = row.Classes;
    // }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGResourceDescriptor'") {
      relevantData.set('resources', row.Classes);
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGBuildableStorage'") {
      relevantData.set(
        'solidStorage',
        row.Classes.filter((item: any) => !item.ClassName.includes('Player'))
      );
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGSchematic'") {
      relevantData.set('milestones', row.Classes);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildablePipeReservoir'"
    ) {
      relevantData.set('fluidStorage', row.Classes);
    }
  });

  return relevantData;
};

// const parseData = (data) => {
//
//
//   console.log(relevantData);
//   // parse recipes
//   const recipeSources = new Map()
//   relevantData.recipes.forEach(item=> {
//     const parsedItems = parseList(item.mProducedIn);
//     const lastElements = parsedItems.map(parseLastDir).map(parseParameter)
//     console.log(lastElements);
//     buildSet.add(...lastElements);
//   });
//
//   console.log(buildSet)
// };

const processExtractors = (data: any): ExtractorMachine[] => {
  const resources = data.get('extractors') ?? [];
  return resources.map((raw: any) => {
    return new ExtractorMachine(raw);
  });
};

const processManufacturer = (data: any): ManufacturerMachine[] => {
  const resources = data.get('manufacturers') ?? [];
  return resources.map((raw: any) => {
    return new ManufacturerMachine(raw);
  });
};

const processStorage = (data: any): StorageMachine[] => {
  const fluidStorage = data.get('fluidStorage') ?? [];
  const solidStorage = data.get('solidStorage') ?? [];

  return solidStorage
    .map((raw: any) => {
      return new SolidStorageMachine(raw);
    })
    .concat(
      fluidStorage.map((raw: any) => {
        return new FluidStorageMachine(raw);
      })
    );
};

const processBeltAttachments = (data: any): Resource[] => {
  const resources = data.get('beltAttachments') ?? [];
  return resources.map((raw: any) => {
    return new BeltAttachmentMachine(raw);
  });
};

const processResources = (data: any): Resource[] => {
  const resources = data.get('resources') ?? [];
  return resources.map((raw: any) => {
    return new Resource(raw);
  });
};

const resourceParser = (data: any) => {
  const resources = processResources(data);
  console.error('!!!!');
  console.log(Resource.toProtoBuf());
  // turn it into protobuf
  const protoValues = toProtoBufFromGeneratedEnum('Resource');
  console.log(protoValues);
  return resources;
};

const nodeParser = (data: any) => {
  // Sources
  const extractors = processExtractors(data);

  // Intermediates
  const manufacturers = processManufacturer(data);

  // Storage
  const storage = processStorage(data);

  // Splitters & mergers
  const beltAttachment = processBeltAttachments(data);

  const protoValues = toProtoBufFromGeneratedEnum('SatisGraphtoryNode');
  console.log(protoValues);
  return [...extractors, ...manufacturers, ...storage, ...beltAttachment];
};

const recipeParser = (data: any) => {
  const recipes = data.get('recipes') ?? [];
  console.log(recipes);

  // return resources.map((raw: any) => {
  //   return new Resource(raw);
  // });
};

const getProto = (cls: ProtoBufable) => {
  let next = Object.getPrototypeOf(cls);

  while (next.constructor.name !== 'Object') {
    const className = next
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    if (className === '') break;

    next = Object.getPrototypeOf(next);
  }
};

const dataParser = (data: any) => {
  /** Process all protobuf enum segments first **/
  console.log(RF_EMPTY.toProtoBufSegment());

  const relevantData = getRelevantData(data);

  const resources = resourceParser(relevantData);
  console.log('Resources', resources);
  const machines = nodeParser(relevantData);
  console.log('Machines', machines);

  const recipes = recipeParser(relevantData);
  console.log('Recipes', recipes);
  //
  getProto(Recipe);
};

export default dataParser;
