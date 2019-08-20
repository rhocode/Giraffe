import ResourcePacket from './resourcePacket';
import Fraction from './fraction';

class ResourceRate {
  resource: ResourcePacket;
  time: number;

  constructor(resource: ResourcePacket, time: number) {
    this.resource = resource;
    this.time = time;
  }

  static getTotalItemRate(rates: ResourceRate[]): Fraction {
    const fractions = rates.map(
      item => new Fraction(item.resource.itemQty, item.time)
    );
    const result = new Fraction(0, 1);
    fractions.forEach(fraction => {
      result.mutateAdd(fraction);
    });

    result.mutateReduce();

    return result;
  }

  static numUniqueResources(rates: ResourceRate[]) {
    const resources = new Set(rates.map(item => item.resource.itemId));

    return resources.size;
  }

  static collect(rates: ResourceRate[]) {
    const mapping: Map<number, Array<ResourceRate>> = new Map();
    rates.forEach(rate => {
      const itemId = rate.resource.itemId;
      if (mapping.get(itemId) === undefined) {
        mapping.set(itemId, []);
      }

      const arr = mapping.get(itemId);
      if (arr === undefined) {
        throw new Error('Arr undefined');
      }

      arr.push(rate);
    });

    const totalResourceRates: Array<ResourceRate> = [];
    Array.from(mapping.entries()).forEach(item => {
      const rates = item[1];
      const itemId = item[0];
      const fractions = rates.map(
        item => new Fraction(item.resource.itemQty, item.time)
      );
      const result = new Fraction(0, 1);
      fractions.forEach(fraction => {
        result.mutateAdd(fraction);
      });
      result.mutateReduce();

      totalResourceRates.push(
        new ResourceRate(
          new ResourcePacket(itemId, result.numerator),
          result.denominator
        )
      );
    });

    return totalResourceRates;
  }

  fractional(fraction: Fraction) {
    const reduced = new Fraction(this.resource.itemQty, this.time);
    reduced.mutateMultiply(fraction).reduce();

    return new ResourceRate(
      new ResourcePacket(this.resource.itemId, reduced.numerator),
      reduced.denominator
    );
  }
}

export default ResourceRate;
