import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import dataField from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataField';
import { setDataFields } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/dataFieldUtils/utils';

import Protoable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/interfaces/protoable';
import generateEnum from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/generateEnum';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';
import preprocessor from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/preprocessor';
import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourcePacket';
import stripClassName, {
  stripClassNameImpl
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/stripClassName';
import SatisGraphtoryNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/satisGraphtoryNode';

@generateEnum('name')
class Recipe extends GqlObject implements Protoable {
  constructor(props: any) {
    super();
    setDataFields(this, props);
  }

  @dataField('ClassName')
  @gqlType('String!')
  @stripClassName
  @preprocessor((data: any) => {
    return data;
  })
  public name: string = '';

  @gqlType('String!')
  @dataField('mDisplayName')
  public displayName: string = '';

  @gqlType('Float!')
  @dataField('mManufactoringDuration')
  public manufacturingDuration: number = 0;

  @gqlType('Float!')
  @dataField('mManualManufacturingMultiplier')
  public manufacturingMultiplier: number = 0;

  @gqlType('[ResourcePacket]')
  @dataField('mIngredients')
  public ingredients: ResourcePacket = ProtoBufable.NULL;

  @gqlType('[ResourcePacket]')
  @dataField('mProduct')
  public product: ResourcePacket = ProtoBufable.NULL;

  @gqlType('[SatisGraphtoryNodeEnum]')
  @dataField('mProducedIn')
  @preprocessor((data: any) => {
    const item = data
      .split('.')
      .slice(-1)[0]
      .replace(/['"]/g, '')
      .replace('FGBuildGun', 'BuildGun')
      .replace('WorkshopComponent', 'WorkBenchComponent')
      .replace('FGBuildableAutomatedWorkBench', 'WorkBenchComponent')
      .replace('AutomatedWorkBench', 'WorkBenchComponent');
    return stripClassNameImpl(item);
  })
  public producedIn: SatisGraphtoryNode = ProtoBufable.NULL;
}

export default Recipe;
