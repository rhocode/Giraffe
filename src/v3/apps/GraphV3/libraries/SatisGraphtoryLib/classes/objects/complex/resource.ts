import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import dataField, {
  setDataFields
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import Protoable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/interfaces/protoable';
import ResourceForm, {
  RF_EMPTY
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/enums/resourceForms';
import stripDesc from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripDesc';
import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';

@generateEnum('name')
class Resource extends GqlObject implements Protoable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('ClassName')
  @gqlType('String!')
  @stripDesc
  public name: string = '';

  @gqlType('String!')
  @dataField('mDisplayName')
  public displayName: string = '';

  @gqlType('String!')
  @dataField('mDescription')
  public description: string = '';

  @gqlType('ResourceForm!')
  @dataField('mForm')
  public resourceForm: ResourceForm = RF_EMPTY;

  @gqlType('Int!')
  @dataField('mResourceSinkPoints')
  public sinkPoints: number = 0;

  @gqlType('Float!')
  @dataField('mEnergyValue')
  public energyValue: number = 0;
}

export default Resource;
