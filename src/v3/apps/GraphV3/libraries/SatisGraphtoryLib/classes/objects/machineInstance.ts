import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';

class MachineInstance extends GqlObject {
  static readonly typeDef = `
  type MachineInstance {
    name: String!
    icon: String
    inputs: Int!
    outputs: Int!
    hidden: Boolean
    tier: UpgradeTier!
    power: Float
    speed: Float
    localOrdering: Int
    machineClass: MachineClass!
  }`;

  constructor() {
    super();
    this.name = 'a';
    this.icon = 'a';
    this.hidden = false;
    this.localOrdering = 0;
    this.speed = 0;
    this.power = 0;
    this.tier = [];
  }

  @gqlType('String!')
  private name: string;

  @gqlType('String')
  private icon: string;

  @gqlType('Int!')
  private inputs: number = 0;

  @gqlType('Int!')
  private outputs: number = 0;

  @gqlType('Boolean')
  private hidden: boolean;

  @gqlType('Int')
  private localOrdering: number;

  @gqlType('MachineClass!')
  private machineClass: string = '';

  @gqlType('Float')
  private speed: number;

  @gqlType('Float')
  private power: number;

  @gqlType('UpgradeTier!')
  private tier: string[];
}

export default MachineInstance;
