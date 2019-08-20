import RecipeProcessorNode from './recipeProcessorNode';
import ResourceRate from '../primitives/resourceRate';
import Belt from './belt';
import DistributedOutput from './distributedOutput';
import Recipe from '../primitives/recipe';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

// Used for normal recipe processors
export default class StrictProducerNode extends RecipeProcessorNode {
  isClusterBoundary: boolean = true;

  distributeOutputs() {
    if (this.recipe) {
      const recipeInput = this.recipe.getInputs();
      const recipeOutputs = Recipe.formRecipeOutput(this.recipe, []);

      if (recipeInput.length) {
        throw new Error('StrictProducer should not have any recipe inputs!');
      }

      Array.from(this.outputs.keys()).forEach(edge => {
        if (!(edge instanceof Belt)) {
          throw new Error("It's not a belt!");
        }

        const belt = edge as Belt;
        belt.clearResources();
      });

      recipeOutputs.forEach(rate => {
        Array.from(this.outputs.keys()).forEach(edge => {
          if (!(edge instanceof Belt)) {
            throw new Error("It's not a belt!");
          }

          const belt = edge as Belt;
          belt.addResource(this, rate);
        });
      });

      let isError = false;
      const excess: Array<ResourceRate> = [];

      Array.from(this.outputs.keys()).forEach(edge => {
        if (!(edge instanceof Belt)) {
          throw new Error("It's not a belt!");
        }

        const belt = edge as Belt;
        const {
          excessResourceRates,
          overflowed,
          errored
        } = belt.getAllResourceRates();

        isError = isError || errored;
        if (overflowed && !errored) {
          excess.push(...excessResourceRates);
        }
      });
      console.error('Strict producer', excess);
      return new DistributedOutput(isError, excess);
    }

    return new DistributedOutput(false, []);
  }

  processInputs(): void {
    // Noop, since a strict producer cannot have inputs.
  }

  backPropagation(
    resourceRate: ResourceRate[]
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    return new Map();
  }
}
