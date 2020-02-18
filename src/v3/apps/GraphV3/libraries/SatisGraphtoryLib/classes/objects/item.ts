import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';

class Item extends GqlObject {
  static readonly typeDef = `
  type Item {
    name: String!
    icon: String
    hidden: Boolean
  }`;
  constructor() {
    super();
    this.name = 'a';
    this.icon = 'a';
  }

  @gqlType('String!')
  private name: string;

  @gqlType('String')
  private icon: string;

  @gqlType('Boolean')
  private hidden: boolean = false;
}

export default Item;
