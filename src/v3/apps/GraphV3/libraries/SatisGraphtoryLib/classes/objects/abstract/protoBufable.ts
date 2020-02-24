import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';

export default abstract class ProtoBufable {
  static NULL: any = 'NULL_PROTOBUFABLE';

  static toProtoBuf() {
    const className = this.toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];
    const fields = allGqlTypes.get(className) ?? new Map<string, string>();
    console.log(className);
    return fields.toString();
  }
}

const whitelistedEntries = [
  'ResourceForm',
  'SatisGraphtoryNodeEnum',
  'ResourceFormEnum',
  'ResourceEnum',
  'ResourcePacket',
  'RecipeEnum',
  'ItemEnum',
  'BeltEnum'
];

const processString = (input: string): object => {
  const parts = input.split('');
  let prefix: string[] = [];
  let repeated = false;
  while (parts.length > 0) {
    const element = parts.pop();
    if (element === '!') {
      continue;
    } else if (element === ']') {
      parts.shift();
      repeated = true;
    } else {
      let item = '';
      const together = parts.join('') + element;
      switch (together) {
        case 'Int':
          item = 'int64';
          break;
        case 'Float':
          item = 'float';
          break;
        case 'String':
          item = 'string';
          break;
        case 'Boolean':
          item = 'bool';
          break;
        default:
          if (!whitelistedEntries.includes(together))
            throw new Error(`Unknown type: ${together}`);
          else item = together;
      }
      prefix.push(item);
      break;
    }
  }

  const retType: any = {
    type: prefix.join('')
  };

  if (repeated) {
    retType['rule'] = 'repeated';
  }

  return retType;
};

export const getProto = (cls: ProtoBufable) => {
  let next = cls;

  if (
    cls
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1] === 'EnumWrapper'
  )
    next = Object.getPrototypeOf(cls);

  let generatedProtos: any = {};
  let firstClassName = '';
  let ptr = 1;
  while (next.constructor.name !== 'Object') {
    const className = next
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    if (className === '') break;
    firstClassName = firstClassName || className;

    const types = allGqlTypes.get(className) ?? new Map<string, string>();
    const generatedProto = [...types.entries()]
      // eslint-disable-next-line no-loop-func
      .map(([key, value]: [string, string]): object => {
        return {
          [key]: {
            ...processString(value),
            id: ptr++
          }
        };
      });

    generatedProtos = {
      ...generatedProtos,
      ...Object.assign({}, ...generatedProto)
    };

    next = Object.getPrototypeOf(next);
  }

  return {
    [firstClassName]: {
      fields: {
        ...generatedProtos
      }
    }
  };
};
