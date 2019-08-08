import RecipeProcessorNode from './recipeProcessorNode';
import ResourcePacket from '../primitives/resourcePacket';
import ResourceRate from '../primitives/resourceRate';
import Belt from './belt';

// Used for normal recipe processors
export default class StrictProducerNode extends RecipeProcessorNode {
  isClusterBoundary: boolean = true;

  distributeOutputs(): void {
    if (this.recipe) {
      const recipeInput = this.recipe.input;
      const recipeOutputs = this.recipe.output;
      const time = this.recipe.time;

      if (recipeInput.length) {
        throw new Error('StrictProducer should not have any recipe inputs!');
      }
      recipeOutputs.forEach(output => {
        const resourceRate = new ResourceRate(output, time);
        Array.from(this.outputs.keys()).forEach(edge => {
          if (!(edge instanceof Belt)) {
            throw new Error("It's not a belt!");
          }

          const belt = edge as Belt;
          belt.addResource(this, resourceRate);
        });
      });
    }
  }

  processInputs(): void {
    // Noop, since a strict producer cannot have inputs.
  }
}
