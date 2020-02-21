import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';

abstract class ProducerMachine extends SatisGraphtoryNode {
  @dataField('mPowerConsumption')
  @gqlType('Float!')
  private powerConsumption: number = 0;

  @dataField('mPowerConsumptionExponent')
  @gqlType('Float!')
  private powerConsumptionExponent: number = 0;

  @dataField('mMinimumProducingTime')
  @gqlType('Float!')
  private minimumProducingTime: number = 0;

  @dataField('mMinimumStoppedTime')
  @gqlType('Float!')
  private minimumStoppedTime: number = 0;
}

export default ProducerMachine;
