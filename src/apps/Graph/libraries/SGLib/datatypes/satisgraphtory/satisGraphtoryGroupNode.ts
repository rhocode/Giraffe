import GroupNode from '../graph/groupNode';
import { processLoop } from '../../algorithms/satisgraphtory/selfFeedingLoop';
import ResourceRate from '../primitives/resourceRate';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import SimpleEdge from '../graph/simpleEdge';

export default class SatisGraphtoryGroupNode extends GroupNode {
  constructor(group: GroupNode) {
    super(group.subNodes);
  }

  processInputs() {
    // no-op I thinK?
  }

  // todo: relate this back to a SatisGraphtoryAbstractNode somehow!
  distributeOutputs() {
    const fractionalEdges = processLoop(this);
    console.error(fractionalEdges);
    //TODO: fix this output shit
  }

  backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    // return new Map();
  }
}
