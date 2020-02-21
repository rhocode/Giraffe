import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ResourceForm from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import {
  shouldStripDesc,
  stripDescImpl
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripDesc';
import {
  shouldStripBuild,
  stripBuildImpl
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripBuild';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import { shouldPreprocess } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/preprocessor';

const allDataFields: Map<string, Map<string, string>> = new Map();

function dataField(type: string) {
  return function(target: any, key: any) {
    const name = target.constructor.name;
    if (!allDataFields.get(name)) {
      allDataFields.set(name, new Map());
    }

    const fetchedMap = allDataFields.get(name);

    if (fetchedMap === undefined) {
      return;
    }

    fetchedMap.set(key, type);
  };
}

const parseList = (list: string) => {
  let parsedList = list.replace(/\(/g, '[');
  parsedList = parsedList.replace(/\)\s/g, '], ');
  parsedList = parsedList.replace(/\)/g, ']');
  parsedList = parsedList.replace(/\s+/, ', ');
  parsedList = parsedList.replace(/[^[\],\s]+/g, '"$&"');
  parsedList = parsedList.replace(/" /g, '", ');

  return JSON.parse(parsedList);
};
const parseRecursive = (
  str: string,
  fieldType: string,
  removeDesc: boolean,
  removeBuild: boolean,
  shouldPreProcess: Function
) => {
  return parseList(str).map((input: string) =>
    parseSingle(input, fieldType, removeDesc, removeBuild, shouldPreProcess)
  );
};

const parseSingle = (
  str: string,
  fieldType: string,
  removeDesc: boolean,
  removeBuild: boolean,
  shouldPreProcess: Function
) => {
  let dataRaw: any = str;

  try {
    switch (fieldType.replace(/\[/g, '').replace(/]/g, '')) {
      case 'Int':
        dataRaw = parseInt(str);
        break;
      case 'Boolean':
        dataRaw = str === 'true';
        break;
      case 'Float':
        dataRaw = parseFloat(str);
        break;
      case 'ResourceForm':
        dataRaw = ResourceForm.from(str);
        break;
      case 'String':
        dataRaw = shouldPreProcess(dataRaw);

        if (removeDesc) {
          dataRaw = stripDescImpl(dataRaw);
        }
        if (removeBuild) {
          dataRaw = stripBuildImpl(dataRaw);
        }
        break;
      case '':
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
  const stripDesc =
    shouldStripDesc.get(className) ?? new Map<string, boolean>();

  const stripBuild =
    shouldStripBuild.get(className) ?? new Map<string, boolean>();
  const preProcess =
    shouldPreprocess.get(className) ?? new Map<string, Function>();

  [...fields.entries()].forEach(
    ([fieldName, dataFieldName]: [string, string]): void => {
      let dataRaw = useDataFieldName ? data[dataFieldName] : data[fieldName];

      const fieldType = (typeFields.get(fieldName) ?? '').replace(/!/g, '');
      const rmDesc = stripDesc.get(fieldName) ?? false;
      const rmBuild = stripBuild.get(fieldName) ?? false;
      const shouldPreProcess =
        preProcess.get(fieldName) ??
        function(a: string): string {
          return a;
        };

      if (fieldType.startsWith('[') && fieldType.endsWith(']')) {
        dataRaw = parseRecursive(
          dataRaw,
          fieldType,
          rmDesc,
          rmBuild,
          shouldPreProcess
        );
      } else {
        dataRaw = parseSingle(
          dataRaw,
          fieldType,
          rmDesc,
          rmBuild,
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

    marshal(
      className,
      data,
      (fieldName: string, dataRaw: any) => ((obj as any)[fieldName] = dataRaw)
    );
    next = Object.getPrototypeOf(next);
  }

  const possibleSupplementary = supplementary[obj?.name] ?? {};
  Object.keys(possibleSupplementary).forEach(item => {
    (obj as any)[item] = possibleSupplementary[item];
  });
};

export default dataField;
