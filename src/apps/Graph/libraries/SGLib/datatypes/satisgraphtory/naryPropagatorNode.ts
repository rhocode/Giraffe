import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import DistributedOutput from './distributedOutput';

// No, I didn't misspell this class. It's an N-Ary propagator node. Used for industrial container
export default class NaryPropagatorNode extends SatisGraphtoryLoopableNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): DistributedOutput {
    return new DistributedOutput(false, []);
  }

  processInputs(): void {}

  distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void {}

  processPresentInputs(nodeSubset: Set<SatisGraphtoryAbstractNode>): void {}
}
