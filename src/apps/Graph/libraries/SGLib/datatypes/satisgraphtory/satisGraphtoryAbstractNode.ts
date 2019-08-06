import SimpleNode from '../graph/simpleNode';
import ResourcePacket from '../primitives/resourcePacket';
import Belt from './belt';

export default abstract class SatisGraphtoryAbstractNode extends SimpleNode {
  resourceIn: Array<ResourcePacket> = [];
  resourceOut: Array<ResourcePacket> = [];
  overclock: number = 100;

  addOutput(target: SimpleNode, dedupe: boolean = false): Belt {
    return super.addOutput(target, dedupe, Belt) as Belt;
  }

  addInput(source: SimpleNode): Belt {
    return super.addInput(source, Belt) as Belt;
  }

  setOverclock(overclock: number) {
    if (overclock > 250 || overclock < 0) {
      throw new Error(
        'Attempted overclock is too large or small! ' + overclock
      );
    }
    this.overclock = overclock;
  }

  setResourceIn(resourceIn: Array<ResourcePacket>) {
    this.resourceIn = resourceIn;
  }

  setResourceOut(resourceOut: Array<ResourcePacket>) {
    this.resourceOut = resourceOut;
  }

  abstract processInputs(): void;

  abstract distributeOutputs(): void;
}
