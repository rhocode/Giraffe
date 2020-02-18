import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';

class BasicMachine extends GqlObject {
  constructor() {
    super();
    this.name = 'a';
    this.id = 0;
  }

  @gqlType('Int!')
  private id: number;

  @gqlType('String!')
  private name: string;

  @gqlType('String')
  private icon: string = '';

  @gqlType('Int!')
  private inputs: number = 0;

  @gqlType('Int!')
  private outputs: number = 0;
}

export default BasicMachine;
