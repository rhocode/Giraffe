import React from 'react';
import Belt from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/edges/Belt";
import ResourceExtractor
  from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/ResourceExtractor";
import {getRecipesByMachineType} from "v3/data/loaders/recipes";
import Manufacturer from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/Manufacturer";

const toMs = (seconds: number) => {
  return seconds * 1000;
}

function HubApp() {
  React.useEffect(() => {
    const possibleRecipes = getRecipesByMachineType('EXTRACTOR');
    const usedRecipe = possibleRecipes[4];
    const building = usedRecipe.producedIn[0];

    console.log(usedRecipe);

    const resourceExtractor = new ResourceExtractor(usedRecipe.slug, building);
    const belt = new Belt(600);

    const manufacturer = new Manufacturer("recipe-ingot-iron", "building-smelter-mk1");

    // resourceExtractor.addOutput(belt);
    belt.addInput(resourceExtractor);
    belt.addOutput(manufacturer)
    //
    // manufacturer.addInput(belt);

    for (let dt = 0; dt < toMs(2) + 200 ; dt+= 50) {
      resourceExtractor.simulate(50, dt)
      // belt.simulate(50, dt)
      // manufacturer.simulate(50, dt);
    }

    //
    for (let dt = toMs(2) + 200; dt < toMs(8) ; dt+= 50) {
      resourceExtractor.simulate(50, dt)
      belt.simulate(50, dt);
      manufacturer.simulate(50, dt);
    }
  })

  return <div/>
}

export default HubApp;
