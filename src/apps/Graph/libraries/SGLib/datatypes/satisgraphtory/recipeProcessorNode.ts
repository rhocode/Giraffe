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

      const allResourceRates = inputEdges
        .map(inp => {
          const { resourceRate } = inp.getAllResourceRates();
          return resourceRate;
        })
        .flat(1);

      if (this.data) {
        console.log(
          'Incoming resources for recipe processor:',
          allResourceRates,
          (this.data as any).id
        );
      }

      const resourcePackets = Recipe.formRecipeOutput(
        this.recipe,
        allResourceRates,
        this.overclock
      );

      console.log('Recipe processor determined output to be', resourcePackets);

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

      const excessRate: Map<SimpleEdge, ResourceRate[]> = new Map();

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

        console.log(
          'recipe processor producer is adding',
          resourceRate,
          'with excess',
          excessResourceRates
        );

        if (overflowed) {
          excessRate.set(belt, excessResourceRates);
        }

        isError = isError || errored;
      });

      console.log('Recipe Processor excess', excessRate);

      return new DistributedOutput(false, excessRate);
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
