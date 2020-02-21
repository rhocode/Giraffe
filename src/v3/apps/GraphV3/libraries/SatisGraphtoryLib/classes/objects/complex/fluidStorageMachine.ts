import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import dataField, {
  setDataFields
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';

import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

import StorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/storageMachine';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';

@generateEnum('name', 'SatisGraphtoryNode')
class FluidStorageMachine extends StorageMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('mStorageCapacity')
  @gqlType('Float!')
  public storageCapacity: number = 0;
}

export default FluidStorageMachine;
