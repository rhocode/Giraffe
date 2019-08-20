import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Recipe from '../primitives/recipe';
import Belt from './belt';
import DistributedOutput from './distributedOutput';
import ResourceRate from '../primitives/resourceRate';

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
          return Array.from(inp.resources.values()).flat(1);
        })
        .flat(1);

      const resourcePackets = Recipe.formRecipeOutput(
        this.recipe,
        allResourceRates
      );

      return new DistributedOutput(false, new Map());
    }

    // const num_outputs = this.outputs.size;
    // Array.from(this.outputs.keys()).forEach(output => {
    //
    // });

    return new DistributedOutput(false, new Map());
  }

  processInputs(): void {
    //TODO: DO NOT DISTRIBUTE OUTPUTS IN THE PROPAGATE FLOWS!!!!!!
    // OTHERWISE, THE NEW SHIT WILL BE WRONG!!!!;
    // noop!
    // const simplifiedRates = ResourceRate.collect(inputEdges.map(edge => edge.getAllResourceRates().resourceRate).flat(1));
  }

  backPropagation(
    resourceRate: ResourceRate[]
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    return new Map();
  }
}
