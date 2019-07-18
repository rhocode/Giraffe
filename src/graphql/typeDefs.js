const typeDefs = `
  type UpgradeTier {
    name: String!
    value: String
  }
  type ResourcePacket {
    item: Item!
    itemQuantity: Int!
  }
  type Item {
    name: String!
    icon: String
    hidden: Boolean
  }
  type Recipe {
    id: String! 
    name: String!
    input: [ResourcePacket]
    output: [ResourcePacket]
    machineClass: MachineClass
    alternate: Boolean
    hidden: Boolean
  }
  
  type MachineClass {
    name: String!
    icon: String
    inputs: Int!
    outputs: Int!
    hidden: Boolean
    localOrdering: Int
    instances: [MachineInstance]
  }

  type MachineInstance {
    name: String!
    icon: String
    inputs: Int!
    outputs: Int!
    hidden: Boolean
    tier: UpgradeTier!
    power: Float
    localOrdering: Int
    machineClass: MachineClass
  }

  type Query {
    getMachineClasses: [MachineClass]
    getMachineClassByName(class_name: String!): MachineClass
    getMachineClassById(class_id: Int!): MachineClass
    getMachineInstances(class_name: String): [MachineClass]
    getRecipeById(recipe_id: Int!): Recipe
    getRecipeByOutputItemId(item_id: Int!): [Recipe]
    getRecipeByInputItemId(item_id: Int!): [Recipe]
    getRecipes: [Recipe]
  }
`;
// cityWeather(city_name: String! applicable_date: String): CityWeather
export default typeDefs;