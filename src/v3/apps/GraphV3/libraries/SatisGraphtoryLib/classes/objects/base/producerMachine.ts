import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';

abstract class ProducerMachine extends GqlObject {
  @dataField('mExtractCycleTime')
  @gqlType('Float!')
  private cycleTime: number = 1;

  @dataField('mItemsPerCycle')
  @gqlType('Int!')
  private itemsPerCycle: number = 1;
}

export default ProducerMachine;
