import ResourcePacket from './resourcePacket';
import ResourceRate from './resourceRate';
import Fraction from './fraction';

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

  static formRecipeOutput = (
    recipe: Recipe,
    resources: ResourceRate[],
    speed: number
  ) => {
    //TODO; (breaking): fix excess recipes
    const collectedResources = ResourceRate.collect(resources);
    let actualRate = new Fraction(Infinity, 1);
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

    if (actualRate.numerator === Infinity && recipe.input.size > 0) {
      return [];
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

      return mappedResources;
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

      return mappedResources;
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
