import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';

export default abstract class SatisGraphtoryLoopableNode extends SatisGraphtoryAbstractNode {
  abstract processPresentInputs(
    nodeSubset: Set<SatisGraphtoryAbstractNode>
  ): void;

  abstract distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void;
}
