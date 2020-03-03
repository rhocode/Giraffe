import ProducerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/producerMachine';
import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataFieldUtils/utils';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ResourceForm from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourceForms';
import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';
import Resource from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resource';

@generateEnum('name', 'SatisGraphtoryNode')
class ExtractorMachine extends ProducerMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  public setResourcesIfEmpty(resources: any) {
    // @ts-ignore
    if (this.allowedResources.length === 0) {
      console.error('THIS IS NULL', resources);
    }
  }

  @dataField('mAllowedResourceForms')
  @gqlType('[ResourceForm!]!')
  public allowedResourceForms: ResourceForm = ProtoBufable.NULL_ARRAY;

  @dataField('mAllowedResources')
  @gqlType('[ItemEnum]')
  public allowedResources: Resource = ProtoBufable.NULL_ARRAY;

  @dataField('mExtractCycleTime')
  @gqlType('Float!')
  private cycleTime: number = 1;

  @dataField('mItemsPerCycle')
  @gqlType('Int!')
  private itemsPerCycle: number = 1;
}

export default ExtractorMachine;
