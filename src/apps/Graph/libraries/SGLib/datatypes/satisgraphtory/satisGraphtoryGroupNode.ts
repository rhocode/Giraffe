import GroupNode from '../graph/groupNode';
import { processLoop } from '../../algorithms/satisgraphtory/selfFeedingLoop';

export default class SatisGraphtoryGroupNode extends GroupNode {
  constructor(group: GroupNode) {
    super(group.subNodes);
  }

  processInputs() {
    // no-op I thinK?
  }

  distributeOutputs() {
    const fractionalEdges = processLoop(this);
    console.error(fractionalEdges);
    //TODO: fix this output shit
  }
}
