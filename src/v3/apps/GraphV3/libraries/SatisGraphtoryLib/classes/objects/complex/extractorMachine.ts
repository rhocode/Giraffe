import ProducerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/producerMachine';
import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import dataField, {
  setDataFields
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ResourceForm, {
  RF_EMPTY
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

@generateEnum('name', 'SatisGraphtoryNode')
class ExtractorMachine extends ProducerMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('mAllowedResourceForms')
  @gqlType('[ResourceForm!]!')
  public allowedResources: ResourceForm = RF_EMPTY;

  @dataField('mExtractCycleTime')
  @gqlType('Float!')
  private cycleTime: number = 1;

  @dataField('mItemsPerCycle')
  @gqlType('Int!')
  private itemsPerCycle: number = 1;
}

export default ExtractorMachine;
