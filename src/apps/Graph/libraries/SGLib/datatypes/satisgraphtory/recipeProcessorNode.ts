import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Recipe from '../primitives/recipe';
import Belt from './belt';
import DistributedOutput from './distributedOutput';
import ResourceRate from '../primitives/resourceRate';
import SimpleEdge from '../graph/simpleEdge';

type Nullable<T> = T | null;

// Used for normal recipe processors
export default class RecipeProcessorNode extends SatisGraphtoryAbstractNode {
  isClusterBoundary: boolean = true;
  recipe: Nullable<Recipe>;

  constructor(data: Nullable<Object>, recipe: Nullable<Recipe>) {
    super(data, false);
    this.recipe = recipe;
  }

  distributeOutputs(): DistributedOutput {
    if (this.recipe) {
      const inputEdges = Array.from(this.inputs.keys()).map(
        item => item as Belt
      );

      const { recipeOutputs, excessResources } = Recipe.calculateRecipeYield(
        this.recipe,
        inputEdges,
        this.overclock
      );

      const outputExcessRate: Map<SimpleEdge, ResourceRate[]> = new Map();

      Array.from(excessResources.entries()).forEach(entry => {
        const belt = entry[0];
        const rate = entry[1];
        outputExcessRate.set(belt, rate);
      });

      const resourcePackets = recipeOutputs;

      // Clear everything from the belt
      Array.from(this.outputs.keys()).forEach(edge => {
        if (!(edge instanceof Belt)) {
          throw new Error("It's not a belt!");
        }

        const belt = edge as Belt;
        belt.clearResources();
      });

      resourcePackets.forEach(rate => {
        Array.from(this.outputs.keys()).forEach(edge => {
          if (!(edge instanceof Belt)) {
            throw new Error("It's not a belt!");
          }

          const belt = edge as Belt;
          belt.addResource(this, rate);
        });
      });

      let isError = false;

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
        } = belt.getAllResourceRates();

        if (overflowed) {
          outputExcessRate.set(belt, excessResourceRates);
        }

        isError = isError || errored;
      });

      return new DistributedOutput(false, outputExcessRate);
    }

    return new DistributedOutput(false, new Map());
  }

  processInputs(): void {
    //TODO: DO NOT DISTRIBUTE OUTPUTS IN THE PROPAGATE FLOWS!!!!!!
    // OTHERWISE, THE NEW SHIT WILL BE WRONG!!!!;
    // noop!
    // const simplifiedRates = ResourceRate.collect(inputEdges.map(edge => edge.getAllResourceRates().resourceRate).flat(1));
  }

  backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    return new Map();
  }
}
