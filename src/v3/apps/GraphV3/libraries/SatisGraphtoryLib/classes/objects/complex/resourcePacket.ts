import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import Protoable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/interfaces/protoable';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';
import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataFieldUtils/utils';

class ResourcePacket extends GqlObject implements Protoable {
  constructor(props: any) {
    super();
    const { resource, amount, name } = props;
    this.resource = resource;
    this.amount = amount;
    this.name = name;
    setDataFields(this, props);
  }

  public name: string = 'RESOURCE_PACKET_NAME';

  @gqlType('ItemEnum!')
  @dataField('resource')
  public resource: Resource = ProtoBufable.NULL;

  @gqlType('Int!')
  public amount: number = 0;

  static fromImport(arr: string[]) {
    const [itemClass, amount] = arr;

    const mangled = itemClass
      .replace(/BP_EquipmentDescriptor/g, 'Desc_')
      .replace(/BP_ItemDescriptor/g, 'Desc_');

    const parsedItemClass = mangled.replace(
      /.*\.Desc_([a-zA-Z0-9-_]+)_C"'/g,
      '$1'
    );
    const parsedItemAmount = parseInt(amount.replace(/Amount=([0-9]+)/g, '$1'));

    return new ResourcePacket({
      name: parsedItemClass + ',' + parsedItemAmount,
      resource: parsedItemClass,
      amount: parsedItemAmount
    });
  }
}

export default ResourcePacket;
