import RecipeProcessorNode from './recipeProcessorNode';
import ResourceRate from '../primitives/resourceRate';
import Belt from './belt';
import DistributedOutput from './distributedOutput';
import Recipe from '../primitives/recipe';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import SimpleEdge from '../graph/simpleEdge';
import Fraction from '../primitives/fraction';

// Used for normal recipe processors
export default class StrictProducerNode extends RecipeProcessorNode {
  isClusterBoundary: boolean = true;

  distributeOutputs() {
    if (this.recipe) {
      const recipeInput = this.recipe.getInputs();
      const { recipeOutputs, excessResources } = Recipe.calculateRecipeYield(
        this.recipe,
        [],
        this.overclock
      );

      if (excessResources.size) {
        throw new Error(
          'Strict producer should not show any excess resources from the recipe'
        );
      }

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

      const excessRate: Map<SimpleEdge, ResourceRate[]> = new Map();
      const actualRate: Map<SimpleEdge, ResourceRate[]> = new Map();

      Array.from(this.outputs.keys()).forEach(edge => {
        if (!(edge instanceof Belt)) {
          throw new Error("It's not a belt!");
        }

        const belt = edge as Belt;
        const {
          resourceRate,
          excessResourceRates,
          overflowed,
          errored
        } = belt.getAllResourceRates(true);

        if (overflowed) {
          excessRate.set(belt, excessResourceRates);
        }
        actualRate.set(belt, resourceRate);
        isError = isError || errored;
      });

      const graphUsedRate = ResourceRate.toResourceMap(
        Array.from(actualRate.values()).flat(1)
      );
      const normalRate = ResourceRate.toResourceMap(recipeOutputs);

      const recipeRates: Map<number, Fraction> = new Map();

      normalRate.forEach((value, key) => {
        const correspondingUsedRate = graphUsedRate.get(key);
        const produced = value
          .toFraction()
          .multiply(new Fraction(60, 1))
          .reduce();
        if (correspondingUsedRate === undefined) {
          throw new Error('Corresponding rate should not be null');
        }
        const needed = correspondingUsedRate
          .toFraction()
          .multiply(new Fraction(60, 1))
          .reduce();
        recipeRates.set(
          key,
          new Fraction(produced.toNumber(), needed.toNumber())
        );
      });

      this.setPropagationData(new Map(), recipeRates);

      //TODO: This strictProducer should not add excess. Instead, it should set its own data to reflect actual vs
      // expected rate.

      // console.error('Strict producer cannot have excess itself, it will propagate to the node');

      return new DistributedOutput(isError, new Map());
    }

    return new DistributedOutput(false, new Map());
  }

  processInputs(): void {
    // Noop, since a strict producer cannot have inputs.
  }

  backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
  }
}
