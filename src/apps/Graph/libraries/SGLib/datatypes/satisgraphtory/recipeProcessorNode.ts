import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Recipe from '../primitives/recipe';
import Belt from './belt';
import DistributedOutput from './distributedOutput';
import ResourceRate from '../primitives/resourceRate';
import SimpleEdge from '../graph/simpleEdge';
import Fraction from '../primitives/fraction';

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

      const {
        recipeOutputs,
        excessResources,
        recipeRates
      } = Recipe.calculateRecipeYield(this.recipe, inputEdges, this.overclock);

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

      // Has no belts hooked up
      if (this.outputs.size === 0) {
        const graphUsedRate = ResourceRate.toResourceMap(recipeOutputs);
        const normalRate = ResourceRate.toResourceMap(recipeOutputs);

        const outputRecipeRates: Map<number, Fraction> = new Map();

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
          outputRecipeRates.set(
            key,
            new Fraction(produced.toNumber(), needed.toNumber())
          );
        });

        this.setPropagationData(recipeRates, outputRecipeRates);

        //TODO:
        // set yourself with resourcePackets

        return new DistributedOutput(false, outputExcessRate);
        // This node has no outputs!
      }

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

      const nodeResourceRates: any = [];

      const actualUsedRate: Map<SimpleEdge, ResourceRate[]> = new Map();

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

        actualUsedRate.set(belt, resourceRate);

        isError = isError || errored;
        nodeResourceRates.push(resourceRate);
      });

      const graphUsedRate = ResourceRate.toResourceMap(
        Array.from(actualUsedRate.values()).flat(1)
      );
      const normalRate = ResourceRate.toResourceMap(recipeOutputs);

      const outputRecipeRates: Map<number, Fraction> = new Map();

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
        outputRecipeRates.set(
          key,
          new Fraction(produced.toNumber(), needed.toNumber())
        );
      });

      this.setPropagationData(recipeRates, outputRecipeRates);

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
  }
}
