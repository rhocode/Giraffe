import {getExtractorRecipes} from "v3/data/loaders/recipes";

const recipes = getExtractorRecipes();

const toMs = (seconds: number) => {
  return seconds * 1000;
}

// it('Creates a manufacturer', () => {
//   const manufacturer = new Manufacturer();
// });

// it('Creates a ResourceExtractor', () => {
//   const possibleRecipes = getRecipesByMachineType('EXTRACTOR');
//   const usedRecipe = possibleRecipes[0];
//   const building = usedRecipe.producedIn[0];
//
//   const resourceExtractor = new ResourceExtractor(usedRecipe, building);
//   //
//   for (let dt = 0; dt < toMs(1); dt+= 50) {
//     resourceExtractor.simulate(50)
//   }
// });

// it('Creates a Belt', () => {
//   const belt = new Belt(1200);
//   //
//   for (let dt = 0; dt < toMs(1); dt+= 50) {
//     belt.simulate(50)
//   }
// });
//
// it('Creates a Belted ResourceExtractor', () => {
//   const possibleRecipes = getRecipesByMachineType('EXTRACTOR');
//   const usedRecipe = possibleRecipes[5];
//   const building = usedRecipe.producedIn[0];
//
//   console.log(usedRecipe);
//
//   const resourceExtractor = new ResourceExtractor(usedRecipe, building);
//   const belt = new Belt(1200);
//
//   const debugSink = new DebugSink();
//
//   belt.addInput(resourceExtractor);
//
//   belt.addOutput(debugSink);
//
//   for (let dt = 0; dt < toMs(3) + 50; dt+= 50) {
//     resourceExtractor.simulate(50, dt)
//     belt.simulate(50, dt)
//   }
// });
