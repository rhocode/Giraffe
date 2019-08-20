import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import DistributedOutput from './distributedOutput';
import ResourceRate from '../primitives/resourceRate';

// Used for normal containers
export default class SimplePropagatorNode extends SatisGraphtoryLoopableNode {
  isClusterBoundary: boolean = false;

  distributeOutputs(): DistributedOutput {
    return new DistributedOutput(false, new Map());
  }

  processInputs(): void {}

  distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void {}

  processPresentInputs(nodeSubset: Set<SatisGraphtoryAbstractNode>): void {}

  backPropagation(
    resourceRate: ResourceRate[]
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    return new Map();
  }
}
