import ProducerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/producerMachine';
import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import dataField, {
  setDataFields
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import ResourceForm, {
  RF_EMPTY
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';

class ExtractorMachine extends ProducerMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('ClassName')
  @gqlType('String!')
  public name: string = '';

  @dataField('mAllowedResourceForms')
  @gqlType('[ResourceForm!]!')
  public allowedResources: ResourceForm = RF_EMPTY;
}

export default ExtractorMachine;
