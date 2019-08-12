import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Fraction from '../primitives/fraction';

export default abstract class SatisGraphtoryLoopableNode extends SatisGraphtoryAbstractNode {
  // abstract processPresentInputs(
  //   nodeSubset: Set<SatisGraphtoryAbstractNode>
  // ): void;

  abstract distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void;

  getTotalResourceRate() {
    const fractions = Array.from(this.resourceIn.values())
      .flat(1)
      .map(rate => {
        return new Fraction(rate.resource.itemQty, rate.time);
      });

    if (fractions.length === 0) {
      return new Fraction(0, 1);
    } else {
      const returnFraction = new Fraction(1, 1);
      fractions.forEach(fraction => {
        returnFraction.mutateMultiply(fraction);
      });
      return returnFraction;
    }
  }
}
