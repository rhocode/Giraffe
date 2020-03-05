import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';
import ExtractorMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/extractorMachine';
import ResourceForm from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourceForms';
import {
  enumToGql,
  enumToProtoBuf
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
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
import { encode } from '@msgpack/msgpack';
import { bytesToBase64 } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/base64';
import * as LZUTF8 from 'lzutf8';
import * as protobuf from 'protobufjs/light';
import satisGraphtoryApplicationSharedTypes from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/satisGraphtoryApplicationSharedTypes';
import Pipe from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/pipe';
import PipeAttachmentMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/pipeAttachmentMachine';

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
      row.NativeClass.match(/Class'\/Script\/FactoryGame.FG.*Descriptor.*'/g) ??
      [].length > 0
    ) {
      if (!relevantData.has('items')) {
        relevantData.set('items', []);
      }
      relevantData.get('items')!.push(...injectedClasses);
    }

    if (row.NativeClass.startsWith("Class'/Script/FactoryGame.FGEquipment")) {
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

    if (row.NativeClass === "Class'/Script/FactoryGame.FGBuildablePipeline'") {
      relevantData.set('pipes', injectedClasses);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildablePipelineJunction'"
      )
    ) {
      if (!relevantData.has('pipeAttachments')) {
        relevantData.set('pipeAttachments', []);
      }
      relevantData.get('pipeAttachments')!.push(...injectedClasses);
    }

    if (
      row.NativeClass.startsWith(
        "Class'/Script/FactoryGame.FGBuildablePipelinePump'"
      )
    ) {
      if (!relevantData.has('pipePump')) {
        relevantData.set('pipePump', []);
      }
      relevantData.get('pipePump')!.push(...injectedClasses);
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

  return resources
    .map((raw: any) => {
      return new ManufacturerMachine(raw);
    })
    .concat([
      new ManufacturerMachine({
        ClassName: 'Converter',
        mDescription: 'Internal conversion by a resource generator',
        mDisplayName: 'Converter'
      }),
      new ManufacturerMachine({
        ClassName: 'BuildGun',
        mDescription: "It's the build gun.",
        mDisplayName: 'Build Gun'
      }),
      new ManufacturerMachine({
        ClassName: 'WorkBenchComponent',
        mDescription: "It's the workbench.",
        mDisplayName: 'Workbench'
      })
    ]);
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

const processPipeAttachments = (data: any): PipeAttachmentMachine[] => {
  const resources = data.get('pipeAttachments') ?? [];
  return resources.map((raw: any) => {
    return new PipeAttachmentMachine(raw);
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
  // console.log(protoValues);
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

  const pipeAttachment = processPipeAttachments(data);

  // console.log(data);

  return {
    extractorMachine: extractors,
    beltAttachmentMachine: beltAttachment,
    pipeAttachmentMachine: pipeAttachment,
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

const pipeParser = (data: any) => {
  const belts = data.get('pipes') ?? [];

  return belts.map((raw: any) => {
    return new Pipe(raw);
  });
};

const extractorRecipeInjector = (
  extractorMachine: any,
  recipes: any,
  resources: any
) => {
  const resourcesMap = new Set(
    resources.map((res: any) => {
      return res.name;
    })
  );

  // Find orphaned resources
  extractorMachine.forEach((machine: any) => {
    if (machine.allowedResources.length !== 0) {
      machine.allowedResources.forEach((res: string) => {
        resourcesMap.delete(res);
      });
    }
  });

  const converterRecipes = recipes
    .filter((recipe: any) => {
      return new Set(recipe.producedIn).has('Converter');
    })
    .map((rec: any) => {
      return rec.product.map((rp: any) => rp.resource);
    })
    .flat(1);

  const intersection = [...converterRecipes].filter(x => resourcesMap.has(x));
  extractorMachine.forEach((machine: any) => {
    if (machine.allowedResources.length === 0) {
      machine.allowedResources = [...intersection];
    }
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
  // console.log('ResourceForms', resourceForms);

  const relevantData = getRelevantData(data);

  // console.log(relevantData);

  const resources = resourceParser(relevantData);

  const items = itemParser(relevantData);

  const machines = nodeParser(relevantData);
  // console.log('Machines', machines);
  // console.log('Items', items);

  const recipes = recipeParser(relevantData);
  // console.log('Recipes', recipes);

  extractorRecipeInjector(machines.extractorMachine, recipes, resources);

  const belts = beltParser(relevantData);

  const pipes = pipeParser(relevantData);
  // console.log('Belts', belts);

  const enums = [
    ResourceForm,
    Resource,
    SatisGraphtoryNode,
    Recipe,
    Item,
    Belt,
    Pipe
  ];

  const dataForms = [
    Recipe,
    ResourcePacket,
    ResourceForm,
    Resource,
    Item,
    ...satisGraphtoryApplicationSharedTypes.edges,
    ...satisGraphtoryApplicationSharedTypes.nodes
  ];

  const allEnums = Object.assign({}, ...enums.map(enumToProtoBuf));

  const allData = Object.assign({}, ...dataForms.map(getProto));

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

  //TODO: 1
  // console.log(JSON.stringify(wrappedEnums, null, 2));

  const wrappedEnumBlob = new Blob([JSON.stringify(wrappedEnums, null, 2)], {
    type: 'application/json'
  });

  saveAs(wrappedEnumBlob, 'SGProto.json');

  const root = protobuf.Root.fromJSON(wrappedEnums);
  const SGProtoData = root.lookupType('satisgraphtory.SGProtoData');

  console.log(root.lookupType('satisgraphtory.Pipe'));

  const protoObj = {
    recipe: recipes,
    resourceForm: resourceForms,
    resource: resources,
    ...machines,
    item: items,
    belt: belts,
    pipe: pipes
  };

  const allEnumsToGql = enums.map(enumToGql).join('\n');
  const allTypesToGql = dataForms.map(item => item.getTypeDef()).join('\n');

  const allGqlTypes = [allEnumsToGql, allTypesToGql].join('\n');

  const code = `const generatedTypeDefs = \`\n${allGqlTypes}\n\`;\nexport default generatedTypeDefs;`;

  const TSCode = new Blob([code], {
    type: 'application/text'
  });

  saveAs(TSCode, 'generatedTypeDefs.ts');

  //TODO: 2
  // console.log(code);

  console.log(protoObj);

  const protoData: any = SGProtoData.fromObject(protoObj);

  console.log(protoData);

  // Problematic checker
  // console.log("PROBLEMATIC:");
  // protoData.recipe.map((item: any) => {
  //   item.product.map((item2: any) => {
  //     if (!item2.resource) {
  //       console.error(item);
  //     }
  //
  //   })
  //
  //   item.ingredients.map((item2: any) => {
  //     if (!item2.resource) {
  //       console.error(item);
  //     }
  //
  //   })
  //   // item.product.map((item: any) => {
  //   //   console.log(item.resource)
  //   //   return item.resource;
  //   // });
  // });

  const encoded: Uint8Array = encode(protoData);
  const base64 = bytesToBase64(encoded);
  const compressed = LZUTF8.compress(base64);
  // console.log(compressed);
  const stringCompressed = bytesToBase64(compressed);
  const finalData = JSON.stringify({ d: stringCompressed });

  //
  // const data1 = testData.d;
  // const stringUnCompressed = toUint8Array(data1);
  // console.log(stringUnCompressed);
  // const decompressed = LZUTF8.decompress(stringUnCompressed);
  // const base64Decompressed = toUint8Array(decompressed);
  // const decoded = decode(base64Decompressed);
  // console.log(decoded);

  const SaveDataBlob = new Blob([finalData], {
    type: 'application/json'
  });
  //
  // console.log('Final blob', SaveDataBlob);
  //
  // console.log(decode, toUint8Array);

  // const item = gqlClient();

  //
  function saveAs(blob: any, fileName: any) {
    return;
    const url = window.URL.createObjectURL(blob);

    const anchorElem = document.createElement('a');
    // anchorElem.style = "display: none";
    anchorElem.href = url;
    anchorElem.download = fileName;

    document.body.appendChild(anchorElem);
    anchorElem.click();
    document.body.removeChild(anchorElem);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function() {
      window.URL.revokeObjectURL(url);
    }, 1000);
  }

  //TODO: 3
  saveAs(SaveDataBlob, 'data.s2');

  // console.log(buffer);
};

export default dataParser;
