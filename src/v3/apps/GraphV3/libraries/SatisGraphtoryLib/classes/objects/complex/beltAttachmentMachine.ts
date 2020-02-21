import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';

import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';

@generateEnum('name', 'SatisGraphtoryNode')
class BeltAttachmentMachine extends SatisGraphtoryNode {
  constructor(props: any) {
    console.log(props);
    super();
    setDataFields(this, props);
    console.log(this);
  }
}

export default BeltAttachmentMachine;
