import SimpleEdge from '../graph/simpleEdge';
import SimpleNode from '../graph/simpleNode';
import ResourceRate from '../primitives/resourceRate';
import Fraction from '../primitives/fraction';

type Nullable<T> = T | null;

// Used for belts
export default class Belt extends SimpleEdge {
  speed: Fraction = new Fraction(0, 1);
  resources: Map<SimpleNode, Array<ResourceRate>> = new Map();
  clampedSpeed: Fraction = new Fraction(0, 1);

  constructor(data: Nullable<Object>, source: SimpleNode, target: SimpleNode) {
    super(data, source, target);
  }

  clearResources() {
    this.resources = new Map();
  }

  addResource(node: SimpleNode, resourceRate: ResourceRate) {
    if (this.resources.get(node) === undefined) {
      this.resources.set(node, []);
    }

    const resourceArray = this.resources.get(node);
    if (resourceArray === undefined) {
      throw new Error('ResourceArray is undefined');
    }

    resourceArray.push(resourceRate);
  }

  getAllResourceRates() {
    const resourceRateRaw = Array.from(this.resources.values()).flat(1);

    const totalResourceRate = new Fraction(0, 1);
    resourceRateRaw.forEach(rate => {
      totalResourceRate.mutateAdd(
        new Fraction(rate.resource.itemQty, rate.time)
      );
    });

    // This resource rate would be per minute!
    // totalResourceRate.mutateMultiply(new Fraction(60, 1)).reduce();
    totalResourceRate.mutateReduce();

    let overflowed = false;
    let errored = false;
    const excessResourceRates: ResourceRate[] = [];

    let resourceRate = resourceRateRaw;
    if (totalResourceRate.toNumber() > this.clampedSpeed.toNumber()) {
      overflowed = true;
      const resources = new Set(
        Array.from(this.resources.values())
          .flat(1)
          .map(item => item.resource.itemId)
      );
      if (resources.size > 1) {
        errored = true;
      }

      const difference = totalResourceRate.subtract(this.clampedSpeed);

      difference.mutateDivide(totalResourceRate);

      resourceRate = [];

      const actualFraction = this.clampedSpeed.divide(totalResourceRate);

      resourceRateRaw.forEach(rate => {
        excessResourceRates.push(rate.fractional(difference));
        resourceRate.push(rate.fractional(actualFraction));
      });
    }

    return {
      resourceRate,
      excessResourceRates,
      overflowed,
      errored
    };
  }

  setSpeed(speed: number) {
    this.speed = new Fraction(speed, 60).mutateReduce();
    this.clampedSpeed = new Fraction(speed, 60).mutateReduce();
  }

  getSpeedInItemsPerSecond() {
    return this.clampedSpeed.reduce();
  }

  getSpeedInItemsPerMinute() {
    return this.clampedSpeed.reduce().multiply(new Fraction(60, 1));
  }

  setClampedSpeed(speed: number) {
    const newSpeed = new Fraction(speed, 60);
    if (newSpeed.toNumber() > this.speed.toNumber()) {
      // super.setWeight(this.speed);
      this.clampedSpeed = this.speed;
    } else {
      // super.setWeight(speed);
      this.clampedSpeed = newSpeed;
    }
  }
}
