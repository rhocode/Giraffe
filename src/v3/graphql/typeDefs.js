import Recipe from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/recipe';
import UpgradeTier from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/upgradeTier';
import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/resourcePacket';
import Item from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/item';
import MachineClass from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/machineClass';
import MachineInstance from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/machineInstance';

const typeDefs = `
  ${UpgradeTier.getTypeDef()} 
  
  ${ResourcePacket.getTypeDef()} 
  
  ${Item.getTypeDef()} 
  
  ${Recipe.getTypeDef()} 
  
  ${MachineClass.getTypeDef()} 

  ${MachineInstance.getTypeDef()}

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
