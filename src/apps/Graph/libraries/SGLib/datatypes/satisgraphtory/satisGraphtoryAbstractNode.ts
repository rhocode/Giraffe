import SimpleNode from '../graph/simpleNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import DistributedOutput from './distributedOutput';
import SimpleEdge from '../graph/simpleEdge';
import { GraphNode } from '../graph/graphNode';
import Fraction from '../primitives/fraction';

export default abstract class SatisGraphtoryAbstractNode extends SimpleNode {
  resourceIn: Map<Belt, Array<ResourceRate>> = new Map();
  resourceOut: Map<Belt, Array<ResourceRate>> = new Map();
  overclock: number = 100;

  setPropagationData(
    inputProp: Map<number, Fraction> = new Map(),
    outputProp: Map<number, Fraction> = new Map()
  ) {
    if (this.data instanceof GraphNode) {
      this.data.setPropagationData(inputProp, outputProp);
    }
  }

  addOutput(
    target: SimpleNode,
    dedupe: boolean = false,
    beltData: any = null
  ): Belt {
    return super.addOutput(target, dedupe, Belt, beltData) as Belt;
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

  addResource(belt: Belt, resourceIn: ResourceRate) {
    if (this.resourceIn.get(belt) === undefined) {
      this.resourceIn.set(belt, []);
    }

    const resourceArray = this.resourceIn.get(belt);
    if (resourceArray === undefined) {
      throw new Error('resourceIn is undefined');
    }

    resourceArray.push(resourceIn);
  }

  // setResourceOut(belt: Belt, resourceIn: Array<ResourceRate>) {
  //   this.resourceOut = resourceOut;
  // }

  abstract processInputs(blacklist?: Set<Belt>): void;

  abstract distributeOutputs(): DistributedOutput;

  abstract backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate>;
}
