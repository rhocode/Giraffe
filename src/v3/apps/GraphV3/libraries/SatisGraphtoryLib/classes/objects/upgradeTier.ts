import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';

class UpgradeTier extends GqlObject {
  static readonly typeDef = `
  type UpgradeTier {
    name: String!
    value: Int!
  }`;
  constructor() {
    super();
    this.value = 20;
    this.name = 'AAA';
  }

  @gqlType('Int!')
  private value: number;

  @gqlType('String!')
  private name: string;
}

export default UpgradeTier;
