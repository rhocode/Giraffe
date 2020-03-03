import { translateEnumToObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import { shouldPreprocess } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/preprocessor';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import { allDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourcePacket';
import {
  shouldStripClassName,
  stripClassNameImpl
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripClassName';

const parseList = (list: string) => {
  let parsedList = list.replace(/\(/g, '[');
  parsedList = parsedList.replace(/\)\s/g, '], ');
  parsedList = parsedList.replace(/\)/g, ']');
  parsedList = parsedList.replace(/\s+/, ', ');
  parsedList = parsedList.replace(/" /g, '", ');
  parsedList = parsedList.replace(/"/g, '\\"');
  parsedList = parsedList.replace(/([a-zA-Z0-9-_=/'\\".]+)/g, '"$1"');

  return JSON.parse(parsedList);
};
const parseRecursive = (
  str: string,
  fieldType: string,
  rmClassName: boolean,
  shouldPreProcess: Function
) => {
  return [
    ...new Set(
      parseList(str).map((input: string) =>
        parseSingle(input, fieldType, rmClassName, shouldPreProcess)
      )
    )
  ];
};

const parseSingle = (
  str: string,
  fieldType: string,
  rmClassName: boolean,
  shouldPreProcess: Function
) => {
  let dataRaw: any = str;

  dataRaw = shouldPreProcess(dataRaw);

  // if (typeof dataRaw === 'string' && dataRaw.length > 20) {
  //   console.error(dataRaw);
  // }

  try {
    switch (fieldType.replace(/\[/g, '').replace(/]/g, '')) {
      case 'Int':
        dataRaw = parseInt(dataRaw);
        break;
      case 'Boolean':
        dataRaw = dataRaw === 'true';
        break;
      case 'Float':
        dataRaw = parseFloat(dataRaw);
        break;
      case 'ResourceForm':
        dataRaw = translateEnumToObject('ResourceForm', dataRaw);
        break;
      case 'ResourcePacket':
        dataRaw = ResourcePacket.fromImport(dataRaw);
        break;
      case 'SatisGraphtoryNodeEnum':
        dataRaw = translateEnumToObject('SatisGraphtoryNode', dataRaw)
          .enumValue;
        break;
      case 'ResourceEnum':
        break;
      case 'ItemEnum':
        break;
      case 'ResourceFormEnum':
        break;
      case 'String':
        if (rmClassName) {
          dataRaw = stripClassNameImpl(dataRaw);
        }
        break;
      default:
        console.error('No fieldType specified with', fieldType, 'for', dataRaw);
        break;
    }
  } finally {
  }
  return dataRaw;
};

function marshal(
  className: string,
  data: any,
  callback: Function,
  useDataFieldName: boolean = true
) {
  const fields = allDataFields.get(className) ?? new Map<string, string>();
  const typeFields = allGqlTypes.get(className) ?? new Map<string, string>();

  const stripClassName =
    shouldStripClassName.get(className) ?? new Map<string, boolean>();

  const preProcess =
    shouldPreprocess.get(className) ?? new Map<string, Function>();

  [...fields.entries()].forEach(
    ([fieldName, dataFieldName]: [string, string]): void => {
      let dataRaw = useDataFieldName ? data[dataFieldName] : data[fieldName];

      const fieldType = (typeFields.get(fieldName) ?? '').replace(/!/g, '');
      const rmClassName = stripClassName.get(fieldName) ?? false;
      const shouldPreProcess =
        preProcess.get(fieldName) ??
        function(a: string): string {
          return a;
        };

      // console.log("PROCESSING", dataRaw);

      if (fieldType.startsWith('[') && fieldType.endsWith(']')) {
        dataRaw = parseRecursive(
          dataRaw,
          fieldType,
          rmClassName,
          shouldPreProcess
        );
      } else {
        dataRaw = parseSingle(
          dataRaw,
          fieldType,
          rmClassName,
          shouldPreProcess
        );
      }

      callback(fieldName, dataRaw);
    }
  );
}

const supplementary = require('development/supplementary.json');

export const setDataFields = (obj: any, data: any) => {
  if (data === undefined) {
    throw new Error('Data fields are undefined!');
  }

  if (!(obj instanceof GqlObject)) {
    throw new Error(
      'setDataFields must be called on class that inherits GqlObject!'
    );
  }

  let next = Object.getPrototypeOf(obj);

  while (next.constructor.name !== 'Object') {
    const className = next.constructor.name;

    marshal(className, data, (fieldName: string, dataRaw: any) => {
      (obj as any)[fieldName] = dataRaw;
    });
    next = Object.getPrototypeOf(next);
  }

  const possibleSupplementary = supplementary[obj?.name] ?? {};
  Object.keys(possibleSupplementary).forEach(item => {
    (obj as any)[item] = possibleSupplementary[item];
  });
};
