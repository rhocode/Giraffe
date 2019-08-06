import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

// Used for normal containers
export default class SimplePropagatorNode extends SatisGraphtoryAbstractNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): void {}

  processInputs(): void {}
}
