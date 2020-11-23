import React from 'react';
import {
  generateBuildingEnums,
  generateItemEnums,
  generateRecipeEnums,
} from 'tools/generateRelease';

function ReleasePage() {
  console.log(generateBuildingEnums());
  console.log(generateRecipeEnums());
  console.log(generateItemEnums());
  return <div>Hello!</div>;
}

export default ReleasePage;
