import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';

function generateGqlObject(name: string, attributes: [[string, string]]) {
  return `
  type ${name} {
${attributes
  .map(([key, value]: [string, string]): string => {
    return `    ${key}: ${value}`;
  })
  .join('\n')}
  }`;
}

abstract class GqlObject extends ProtoBufable {
  public abstract name: string;

  static getTypeDef() {
    let next = this;

    if (
      next
        .toString()
        .split('(' || /s+/)[0]
        .split(' ' || /s+/)[1] === 'EnumWrapper'
    ) {
      next = Object.getPrototypeOf(next);
    }

    const topLevelname = next
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    const allFields: any = [];

    while (next.constructor.name !== 'Object') {
      const className = next
        .toString()
        .split('(' || /s+/)[0]
        .split(' ' || /s+/)[1];

      const attributes =
        allGqlTypes.get(className) ?? new Map<string, string>();

      allFields.push(...attributes.entries());

      next = Object.getPrototypeOf(next);
    }

    return generateGqlObject(topLevelname, allFields);
  }

  public toEnum(): number {
    throw new Error('Unimplemented!');
  }
}

export default GqlObject;
