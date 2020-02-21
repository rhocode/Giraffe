import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';

import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

import StorageMachine from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/storageMachine';

@generateEnum('name', 'SatisGraphtoryNode')
class SolidStorageMachine extends StorageMachine implements ProtoSerializable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }
}

export default SolidStorageMachine;
