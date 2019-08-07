import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

// Used for normal containers
export default class SimplePropagatorNode extends SatisGraphtoryLoopableNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): void {}

  processInputs(): void {}

  distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void {}

  processPresentInputs(nodeSubset: Array<SatisGraphtoryAbstractNode>): void {}
}
