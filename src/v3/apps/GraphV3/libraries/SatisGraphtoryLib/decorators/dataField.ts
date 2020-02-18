import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ResourceForm from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import {
  shouldStripDesc,
  stripDescImpl
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripDesc';

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
  removeDesc: boolean
) => {
  return parseList(str).map((input: string) =>
    parseSingle(input, fieldType, removeDesc)
  );
};

const parseSingle = (str: string, fieldType: string, removeDesc: boolean) => {
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
        if (removeDesc) {
          dataRaw = stripDescImpl(dataRaw);
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

  [...fields.entries()].forEach(
    ([fieldName, dataFieldName]: [string, string]): void => {
      let dataRaw = useDataFieldName ? data[dataFieldName] : data[fieldName];

      const fieldType = (typeFields.get(fieldName) ?? '').replace(/!/g, '');
      const rmDesc = stripDesc.get(fieldName) ?? false;
      if (fieldType.startsWith('[') && fieldType.endsWith(']')) {
        dataRaw = parseRecursive(dataRaw, fieldType, rmDesc);
      } else {
        dataRaw = parseSingle(dataRaw, fieldType, rmDesc);
      }

      callback(fieldName, dataRaw);
    }
  );
}

export const setDataFields = (obj: any, data: any) => {
  if (data === undefined) {
    throw new Error('Data fields are undefined!');
  }

  let next = Object.getPrototypeOf(obj);

  while (next.constructor.name !== 'Object') {
    const className = next.constructor.name;

    marshal(
      className,
      data,
      (fieldName: string, dataRaw: any) => (obj[fieldName] = dataRaw)
    );
    next = Object.getPrototypeOf(next);
  }
};

export default dataField;
