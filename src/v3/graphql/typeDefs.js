const typeDefs = `


  type Query {
    getMachineClasses: [MachineClass]
    getCraftingMachineClasses: [MachineClass]
    getAllMachineClasses: [MachineClass]
    getMachineClassByName(class_name: String!): MachineClass
    getMachineClassById(class_id: Int!): MachineClass
    getMachineInstances(class_name: String): [MachineClass]
    getRecipeById(recipe_id: Int!): Recipe
    getRecipeByOutputItemId(item_id: Int!): [Recipe]
    getRecipeByInputItemId(item_id: Int!): [Recipe]
    getRecipeByInputItemName(item_name: String!): [Recipe]
    getRecipeByOutputItemName(item_name: String!): [Recipe]
    getRecipes: [Recipe]
  }
`;
console.log(typeDefs);
export default typeDefs;
