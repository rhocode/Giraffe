import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';
import MachineClass from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/machineClass';
import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/resourcePacket';

class Recipe extends GqlObject {
  static readonly typeDef = `
  type Recipe {
    id: String! 
    name: String!
    input: [ResourcePacket]!
    output: [ResourcePacket]!
    machineClass: MachineClass!
    alternate: Boolean
    time: Float!
    hidden: Boolean
  }`;
  constructor() {
    super();
    this.id = 'aaa';
    this.name = 'AAA';
    this.time = 200;
    this.machineClass = new MachineClass();
  }

  @gqlType('String!')
  private id: string;

  @gqlType('String!')
  private name: string;

  @gqlType('[ResourcePacket]!')
  private input: ResourcePacket[] = [];

  @gqlType('[ResourcePacket]!')
  private output: ResourcePacket[] = [];

  @gqlType('MachineClass!')
  private machineClass: MachineClass;

  @gqlType('Boolean')
  private alternate: boolean = false;

  @gqlType('Float!')
  private time: number;

  @gqlType('Boolean')
  private hidden: boolean = false;
}

export default Recipe;
