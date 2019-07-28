import { gcf } from '../../algorithms/splitterSimulation';

class Fraction {
  numerator: number;
  denominator: number;

  protected constructor(numerator: number, denominator: number) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  public toString(rounding: number = 10): string {
    const multiplier = Math.pow(10, rounding);
    return `${Math.round((this.numerator / this.denominator) * multiplier) /
      multiplier}`;
  }

  public multiply(numerator: number, denominator: number) {
    const newNumerator = this.numerator * numerator;
    const newDenominator = this.denominator * denominator;
    const common = gcf([newNumerator, newDenominator]);

    this.numerator = newNumerator / common;
    this.denominator = newDenominator / common;
  }

  public divide(numerator: number, denominator: number) {
    this.multiply(denominator, numerator);
  }
}

export default Fraction;
