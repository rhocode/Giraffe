import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';
import GqlObject from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/base/gqlObject';

class MachineClass extends GqlObject {
  static readonly typeDef = `
  type MachineClass {
    id: Int! 
    name: String!
    icon: String
    inputs: Int!
    outputs: Int!
    hidden: Boolean
    localOrdering: Int
    recipes: [Recipe]
    hasUpgrades: Boolean
    instances: [MachineInstance]
    tiers: [UpgradeTier]
  }`;
  constructor() {
    super();
    this.name = 'a';
    this.icon = 'a';
    this.id = 0;
    this.hidden = false;
    this.localOrdering = 0;
    this.recipes = [];
    this.hasUpgrades = false;
    this.instances = [];
    this.tiers = [];
  }

  @gqlType('Int!')
  private id: number;

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

  @gqlType('[Recipe]')
  private recipes: string[];

  @gqlType('Boolean')
  private hasUpgrades: boolean;

  @gqlType('[MachineInstance]')
  private instances: string[];

  @gqlType('[UpgradeTier]')
  private tiers: string[];
}

export default MachineClass;
