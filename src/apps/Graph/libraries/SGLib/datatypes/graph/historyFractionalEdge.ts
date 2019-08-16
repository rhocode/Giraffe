import SimpleEdge from './simpleEdge';
import Fraction from '../primitives/fraction';

type FractionOrNumber = number | Fraction;

export default class HistoryFractionalEdge extends SimpleEdge {
  archivedWeight: Fraction = new Fraction(0, 1);
  fractionalWeight: Fraction = new Fraction(0, 1);

  setWeight(weight: FractionOrNumber) {
    if (weight instanceof Fraction) {
      this.fractionalWeight = weight;
    } else {
      this.fractionalWeight = new Fraction(weight, 1);
    }
    return this;
  }

  archive() {
    this.archivedWeight.mutateAdd(this.fractionalWeight);
  }

  clearWeight() {
    this.fractionalWeight = new Fraction(0, 1);
  }
}
