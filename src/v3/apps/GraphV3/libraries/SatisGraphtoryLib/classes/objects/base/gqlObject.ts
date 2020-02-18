import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';

function generateGqlObject(name: string, attributes: Map<string, string>) {
  return `
  type ${name} {
${[...attributes.entries()]
  .map(([key, value]: [string, string]): string => {
    return `    ${key}: ${value}`;
  })
  .join('\n')}
  }`;
}

abstract class GqlObject extends ProtoBufable {
  static getTypeDef() {
    const className = this.toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];
    const fields = allGqlTypes.get(className) ?? new Map<string, string>();
    return generateGqlObject(className, fields);
  }

  public toEnum(): number {
    throw new Error('Unimplemented!');
  }
}

export default GqlObject;
