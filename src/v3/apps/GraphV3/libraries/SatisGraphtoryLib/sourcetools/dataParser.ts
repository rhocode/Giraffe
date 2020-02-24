import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';
import ExtractorMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/extractorMachine';
import ResourceForm from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourceForms';
import { enumToProtoBuf } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import ManufacturerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/manufacturerMachine';
import StorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/storageMachine';
import SolidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/solidStorageMachine';
import FluidStorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/fluidStorageMachine';
import BeltAttachmentMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/beltAttachmentMachine';
import Recipe from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/recipe';
import { getProto } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';
import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';
import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourcePacket';
import Item from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/item';
import Belt from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/belt';

const protobuf = require('protobufjs/light');

const parseParameter = (str: string) => {
  return str
    .split('.')
    .slice(-1)[0]
    .replace(/['"]/g, '');
};

const getRelevantData = (data: any) => {
  const relevantData: Map<string, Array<string>> = new Map();
  data.forEach((row: any) => {
    const rowClass = parseParameter(row.NativeClass);
    const injectedClasses = row.Classes.map((item: any) => {
      return { ...item, mDataClass: rowClass };
    });
    if (
      row.NativeClass.startsWith("Class'/Script/FactoryGame.FGItemDescriptor")
    ) {
      if (!relevantData.has('items')) {
        relevantData.set('items', []);
      }
      relevantData.get('items')!.push(...injectedClasses);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableAttachment"
      )
    ) {
      if (!relevantData.has('beltAttachments')) {
        relevantData.set('beltAttachments', []);
      }
      relevantData.get('beltAttachments')!.push(...injectedClasses);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableSplitter"
      )
    ) {
      if (!relevantData.has('beltAttachments')) {
        relevantData.set('beltAttachments', []);
      }
      relevantData.get('beltAttachments')!.push(...injectedClasses);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildableGenerator"
      )
    ) {
      if (!relevantData.has('generators')) {
        relevantData.set('generators', []);
      }
      relevantData.get('generators')!.push(...injectedClasses);
    }

    if (
      row.NativeClass ===
      "Class'/Script/FactoryGame.FGBuildableResourceExtractor'"
    ) {
      relevantData.set('extractors', injectedClasses);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildableManufacturer'"
    ) {
      relevantData.set('manufacturers', injectedClasses);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildableConveyorBelt'"
    ) {
      relevantData.set('belts', injectedClasses);
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGRecipe'") {
      relevantData.set('recipes', injectedClasses);
    }

    // if (row.NativeClass === "Class'/Script/FactoryGame.FGBuildingDescriptor'") {
    //   relevantData.buildings = injectedClasses;
    // }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGResourceDescriptor'") {
      relevantData.set('resources', injectedClasses);
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGBuildableStorage'") {
      relevantData.set(
        'solidStorage',
        injectedClasses.filter(
          (item: any) => !item.ClassName.includes('Player')
        )
      );
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGSchematic'") {
      relevantData.set('milestones', injectedClasses);
    }

    if (
      row.NativeClass === "Class'/Script/FactoryGame.FGBuildablePipeReservoir'"
    ) {
      relevantData.set('fluidStorage', injectedClasses);
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

const processStorage = (
  data: any
): {
  fluidStorageMachine: StorageMachine[];
  solidStorageMachine: StorageMachine[];
} => {
  const fluidStorage: any = data.get('fluidStorage') ?? [];
  const solidStorage: any = data.get('solidStorage') ?? [];

  return {
    fluidStorageMachine: fluidStorage.map((raw: any) => {
      return new FluidStorageMachine(raw);
    }),
    solidStorageMachine: solidStorage.map((raw: any) => {
      return new SolidStorageMachine(raw);
    })
  };
};

const processBeltAttachments = (data: any): BeltAttachmentMachine[] => {
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
  // turn it into protobuf
  const protoValues = enumToProtoBuf(Resource);
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

  return {
    extractorMachine: extractors,
    beltAttachmentMachine: beltAttachment,
    ...storage,
    manufacturerMachine: manufacturers
  };
};

const recipeParser = (data: any) => {
  const recipes = data.get('recipes') ?? [];

  return recipes.map((raw: any) => {
    return new Recipe(raw);
  });
};

const itemParser = (data: any) => {
  const recipes = data.get('items') ?? [];

  return recipes.map((raw: any) => {
    return new Item(raw);
  });
};

const beltParser = (data: any) => {
  const belts = data.get('belts') ?? [];

  return belts
    .map((raw: any) => {
      return new Belt(raw);
    })
    .sort((a: Belt, b: Belt) => {
      return a.speed - b.speed;
    });
};

const generateResourceForms = () => {
  const resources = ['RF_LIQUID', 'RF_SOLID'];
  return resources.map((rf: string) => {
    return new ResourceForm({ ClassName: rf });
  });
};

const dataParser = (data: any) => {
  /** Process all protobuf enum segments first **/
  const resourceForms = generateResourceForms();
  console.log('ResourceForms', resourceForms);

  const relevantData = getRelevantData(data);

  console.log(relevantData);

  const resources = resourceParser(relevantData);
  console.log('Resources', resources);
  const machines = nodeParser(relevantData);
  console.log('Machines', machines);

  const items = itemParser(relevantData);
  console.log('Items', items);

  const recipes = recipeParser(relevantData);
  console.log('Recipes', recipes);

  const belts = beltParser(relevantData);
  console.log('Belts', belts);

  const enums = [
    ResourceForm,
    Resource,
    SatisGraphtoryNode,
    Recipe,
    Item,
    Belt
  ];

  const dataForms = [
    Recipe,
    ResourcePacket,
    ResourceForm,
    Resource,
    ExtractorMachine,
    BeltAttachmentMachine,
    FluidStorageMachine,
    ManufacturerMachine,
    SolidStorageMachine,
    Item,
    Belt
  ];

  const allEnums = Object.assign({}, ...enums.map(enumToProtoBuf));
  const allData = Object.assign({}, ...dataForms.map(getProto));

  console.log(allData);

  const saveData: any = {
    SGProtoData: {
      fields: {}
    }
  };

  dataForms
    .filter(item => item.prototype.constructor.name === 'EnumWrapper')
    .forEach((item, index) => {
      const name = Object.getPrototypeOf(item).prototype.constructor.name;
      const fieldName = name.replace(/^\w/, (c: string) => c.toLowerCase());
      saveData['SGProtoData']['fields'][fieldName] = {
        type: name,
        rule: 'repeated',
        id: index + 1
      };
    });

  const wrappedEnums = {
    nested: {
      satisgraphtory: {
        nested: {
          ...saveData,
          ...allEnums,
          ...allData
        }
      }
    }
  };

  const root = protobuf.Root.fromJSON(wrappedEnums);
  const SGProtoData = root.lookupType('satisgraphtory.SGProtoData');

  const protoObj = {
    recipe: recipes,
    resourceForm: resourceForms,
    resource: resources,
    ...machines,
    item: items,
    belt: belts
  };
  // const protoData = SGProtoData.fromObject(protoObj);

  const buffer = SGProtoData.encode(protoObj).finish();

  console.log(buffer);
};

export default dataParser;
