import ResourcePacket from './resourcePacket';
import ResourceRate from './resourceRate';
import Fraction from './fraction';
import Belt from '../satisgraphtory/belt';

type RecipeCalculation = {
  recipeOutputs: ResourceRate[];
  excessResources: Map<Belt, ResourceRate[]>;
};

class Recipe {
  private input: Map<number, number>;
  private output: Map<number, number>;
  private readonly time: number;

  constructor(
    input: Array<ResourcePacket>,
    output: Array<ResourcePacket>,
    time: number
  ) {
    this.input = new Map();

    input.forEach(packet => {
      const itemId = packet.itemId;
      const itemQty = packet.itemQty;
      const retrieval = this.input.get(itemId);

      if (retrieval) {
        this.input.set(itemId, retrieval + itemQty);
      } else {
        this.input.set(itemId, itemQty);
      }
    });

    this.output = new Map();

    output.forEach(packet => {
      const itemId = packet.itemId;
      const itemQty = packet.itemQty;
      const retrieval = this.output.get(itemId);

      if (retrieval) {
        this.output.set(itemId, retrieval + itemQty);
      } else {
        this.output.set(itemId, itemQty);
      }
    });

    this.time = time;
  }

  static calculateRecipeYield = (
    recipe: Recipe,
    belts: Belt[],
    speed: number
  ): RecipeCalculation => {
    //TODO; (breaking): fix excess recipes

    const beltResourceRateMap: Map<Belt, ResourceRate[]> = new Map();
    const beltExcessResourceRateMap: Map<Belt, ResourceRate[]> = new Map();
    const resources = belts
      .map(inp => {
        const { resourceRate } = inp.getAllResourceRates();
        beltResourceRateMap.set(inp, resourceRate);
        beltExcessResourceRateMap.set(inp, []);
        return resourceRate;
      })
      .flat(1);

    console.error(
      'Processing recipe. According to this, the resources in are:',
      resources
    );

    const collectedResources = ResourceRate.collect(resources);

    let actualRate = new Fraction(Infinity, 1);

    // Calculate the rate at which the item is produced.
    collectedResources.forEach(incomingResource => {
      const itemId = incomingResource.resource.itemId;
      const correspondingItemQty = recipe.input.get(itemId);

      if (correspondingItemQty === undefined) {
        throw new Error('Should not be able to get here!');
      }

      const externalResource = new Fraction(
        incomingResource.resource.itemQty,
        incomingResource.time
      );
      const thisResource = new Fraction(
        correspondingItemQty,
        recipe.time
      ).multiply(new Fraction(speed, 100));

      const minimum = externalResource.min(thisResource);

      const efficiency = minimum.divide(thisResource);

      actualRate = actualRate.min(efficiency);
    });

    const excessResourceRate: Map<number, Fraction> = new Map();

    collectedResources.forEach(incomingResource => {
      const itemId = incomingResource.resource.itemId;
      const correspondingItemQty = recipe.input.get(itemId);

      if (correspondingItemQty === undefined) {
        throw new Error('Should not be able to get here!');
      }

      const externalResource = new Fraction(
        incomingResource.resource.itemQty,
        incomingResource.time
      );
      const thisResource = new Fraction(
        correspondingItemQty,
        recipe.time
      ).multiply(new Fraction(speed, 100));

      const recipeResourceFraction = thisResource.divide(actualRate);

      const scaledExternalResourceRate = externalResource.multiply(
        recipeResourceFraction
      );

      const excessExternalResourceRate = externalResource
        .subtract(scaledExternalResourceRate)
        .reduce();

      excessResourceRate.set(itemId, excessExternalResourceRate);
    });

    // Resolve the belt rates
    Array.from(beltResourceRateMap.entries()).forEach(entry => {
      const belt = entry[0];
      const rates = entry[1];
      rates.forEach(rate => {
        const fetchedRate = excessResourceRate.get(rate.resource.itemId);
        const beltExcess = beltExcessResourceRateMap.get(belt);
        if (fetchedRate !== undefined && beltExcess !== undefined) {
          if (fetchedRate.numerator !== 0) {
            const scaledExcess = rate.toFraction().multiply(fetchedRate);
            beltExcess.push(
              new ResourceRate(
                new ResourcePacket(
                  rate.resource.itemId,
                  scaledExcess.numerator
                ),
                scaledExcess.denominator
              )
            );
          }
        } else {
          throw new Error('Fetched rate or belt excess is undefined');
        }
      });
    });

    if (actualRate.numerator === Infinity && recipe.input.size > 0) {
      return {
        recipeOutputs: [],
        excessResources: beltExcessResourceRateMap
      };
    } else if (actualRate.numerator === Infinity && recipe.input.size === 0) {
      const mappedResources = Array.from(recipe.output.entries()).map(entry => {
        const itemId = entry[0];
        const itemQty = entry[1];
        const time = recipe.time;

        const rate = new Fraction(itemQty, time).reduce();
        return new ResourceRate(
          new ResourcePacket(itemId, rate.numerator),
          rate.denominator
        );
      });

      return {
        recipeOutputs: mappedResources,
        excessResources: beltExcessResourceRateMap
      };
    } else {
      const mappedResources = Array.from(recipe.output.entries()).map(entry => {
        const itemId = entry[0];
        const itemQty = entry[1];
        const time = recipe.time;

        const rate = new Fraction(itemQty, time);

        rate.mutateMultiply(actualRate).mutateReduce();

        return new ResourceRate(
          new ResourcePacket(itemId, rate.numerator),
          rate.denominator
        );
      });

      return {
        recipeOutputs: mappedResources,
        excessResources: beltExcessResourceRateMap
      };
    }
  };

  getInputs() {
    return Array.from(this.input.entries()).map(entry => {
      return new ResourceRate(
        new ResourcePacket(entry[0], entry[1]),
        this.time
      );
    });
  }

  getOutputs() {
    return Array.from(this.output.entries()).map(entry => {
      return new ResourceRate(
        new ResourcePacket(entry[0], entry[1]),
        this.time
      );
    });
  }
}

export default Recipe;
