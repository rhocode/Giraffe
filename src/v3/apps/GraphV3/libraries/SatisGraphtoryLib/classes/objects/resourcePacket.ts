import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import Item from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/item';

class ResourcePacket extends GqlObject {
  static readonly typeDef = `
  type ResourcePacket {
    item: Item!
    itemQuantity: Int!
  }`;
  constructor() {
    super();
    this.item = new Item();
    this.itemQuantity = 20;
  }

  @gqlType('Item!')
  private item: Item;

  @gqlType('Int!')
  private itemQuantity: number;
}

export default ResourcePacket;
