import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataFieldUtils/utils';

import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';

@generateEnum('name', 'SatisGraphtoryNode')
class BeltAttachmentMachine extends SatisGraphtoryNode {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }
}

export default BeltAttachmentMachine;
