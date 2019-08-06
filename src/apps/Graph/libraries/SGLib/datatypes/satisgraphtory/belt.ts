import SimpleEdge from '../graph/simpleEdge';
import ResourcePacket from '../primitives/resourcePacket';
import SimpleNode from '../graph/simpleNode';

type Nullable<T> = T | null;

// Used for belts
export default class Belt extends SimpleEdge {
  speed: number = Infinity;
  contains: Array<ResourcePacket> = [];
  clampedSpeed: number = Infinity;

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
