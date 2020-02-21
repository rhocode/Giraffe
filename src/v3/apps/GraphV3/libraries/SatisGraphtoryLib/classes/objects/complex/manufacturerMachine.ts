import ProducerMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/producerMachine';
import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import dataField, {
  setDataFields
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';

import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';

@generateEnum('name', 'SatisGraphtoryNode')
class ManufacturerMachine extends ProducerMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('mManufacturingSpeed')
  @gqlType('Float!')
  private manufacturingSpeed: number = 0;
}

export default ManufacturerMachine;
