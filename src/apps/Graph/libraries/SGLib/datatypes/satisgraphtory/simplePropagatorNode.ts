import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import DistributedOutput from './distributedOutput';

// Used for normal containers
export default class SimplePropagatorNode extends SatisGraphtoryLoopableNode {
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
