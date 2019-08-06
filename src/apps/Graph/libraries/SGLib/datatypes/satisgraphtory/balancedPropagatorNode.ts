import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

// Used for splitters and mergers (although not smart splitters)
export default class BalancedPropagatorNode extends SatisGraphtoryAbstractNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): void {}

  processInputs(): void {}
}
