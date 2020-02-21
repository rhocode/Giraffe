import ProtoSerializable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/protoSerializable';
import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';

abstract class StorageMachine extends SatisGraphtoryNode
  implements ProtoSerializable {}

export default StorageMachine;
