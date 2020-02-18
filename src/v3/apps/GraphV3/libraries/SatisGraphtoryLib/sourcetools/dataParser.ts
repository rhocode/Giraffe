import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';
import ExtractorMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/extractorMachine';
import { RF_EMPTY } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import { toProtoBufFromGeneratedEnum } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

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
        'storage',
        row.Classes.filter((item: any) => !item.ClassName.includes('Player'))
      );
    }

    if (row.NativeClass === "Class'/Script/FactoryGame.FGSchematic'") {
      relevantData.set('milestones', row.Classes);
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

const processResources = (data: any): Resource[] => {
  const resources = data.get('resources') ?? [];
  return resources.map((raw: any) => {
    return new Resource(raw);
  });
};

const resourceParser = (data: any) => {
  const resources = processResources(data);
  console.log(resources);
  // turn it into protobuf
  const protoValues = toProtoBufFromGeneratedEnum('Resource');
  console.log(resources.map(item => item.toEnum()));
  console.log(protoValues);
};

const machineParser = (data: any) => {
  // Sources
  const extractors = processExtractors(data);
};

const dataParser = (data: any) => {
  /** Process all protobuf enum segments first **/
  console.log(RF_EMPTY.toProtoBufSegment());

  const relevantData = getRelevantData(data);
  const resources = resourceParser(relevantData);

  const machines = machineParser(relevantData);

  console.log(relevantData);
};

export default dataParser;
