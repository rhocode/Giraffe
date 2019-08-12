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

  constructor(data: Nullable<Object>, source: SimpleNode, target: SimpleNode) {
    super(data, source, target);
  }

  getAllResourceRates() {
    const resourceRate = Array.from(this.resources.values()).flat(1);

    // todo: make an error when the resourceRate is
    // console.error("Node exceeds ")

    const totalResourceRate = new Fraction(0, 1);
    resourceRate.forEach(rate => {
      totalResourceRate.addMutate(
        new Fraction(rate.resource.itemQty, rate.time)
      );
    });

    totalResourceRate.mutateMultiply(new Fraction(60, 1)).reduce();

    let overflowed = false;
    let errored = false;

    if (totalResourceRate.toNumber() > this.speed.toNumber()) {
      overflowed = true;
      const resources = new Set(
        Array.from(this.resources.values())
          .flat(1)
          .map(item => item.resource.itemId)
      );
      if (resources.size > 1) {
        errored = true;
      }
    }

    return {
      resourceRate,
      overflowed,
      errored
    };
  }

  setSpeed(speed: number) {
    this.speed = new Fraction(speed, 60);
    this.clampedSpeed = new Fraction(speed, 60);
  }

  getSpeedInItemsPerSecond() {
    return this.speed.reduce();
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
