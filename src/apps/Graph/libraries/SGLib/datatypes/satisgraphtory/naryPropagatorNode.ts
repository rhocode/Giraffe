import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

// No, I didn't misspell this class. It's an N-Ary propagator node. Used for industrial container
export default class NaryPropagatorNode extends SatisGraphtoryAbstractNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): void {}

  processInputs(): void {}
}
