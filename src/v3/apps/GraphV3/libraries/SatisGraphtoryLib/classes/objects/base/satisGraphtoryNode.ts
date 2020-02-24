import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import stripClassName from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripClassName';

abstract class SatisGraphtoryNode extends GqlObject {
  @dataField('ClassName')
  @gqlType('String!')
  @stripClassName
  public name: string = '';

  @dataField('mDisplayName')
  @gqlType('String!')
  public displayName: string = '';

  @dataField('mDescription')
  @gqlType('String!')
  public description: string = '';

  @dataField('mMinPotential')
  @gqlType('Float!')
  private minPotential: number = 0;

  @dataField('mMaxPotential')
  @gqlType('Float!')
  private maxPotential: number = 0;

  @dataField('mMaxPotentialIncreasePerCrystal')
  @gqlType('Float!')
  private maxPotentialIncreasePerCrystal: number = 0;

  public numFluidInputs: number = 0;
  public numFluidOutputs: number = 0;
  public numSolidInputs: number = 0;
  public numSolidOutputs: number = 0;
}

export default SatisGraphtoryNode;
