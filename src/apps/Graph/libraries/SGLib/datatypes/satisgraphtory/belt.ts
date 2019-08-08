import SimpleEdge from '../graph/simpleEdge';
import ResourcePacket from '../primitives/resourcePacket';
import SimpleNode from '../graph/simpleNode';
import ResourceRate from '../primitives/resourceRate';

type Nullable<T> = T | null;

// Used for belts
export default class Belt extends SimpleEdge {
  speed: number = Infinity;
  resources: Map<SimpleNode, Array<ResourceRate>> = new Map();
  clampedSpeed: number = Infinity;

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

  setSpeed(speed: number) {
    this.speed = speed;
    this.clampedSpeed = speed;
  }

  setClampedSpeed(speed: number) {
    if (speed > this.speed) {
      super.setWeight(this.speed);
      this.clampedSpeed = this.speed;
    } else {
      super.setWeight(speed);
      this.clampedSpeed = speed;
    }
  }
}
