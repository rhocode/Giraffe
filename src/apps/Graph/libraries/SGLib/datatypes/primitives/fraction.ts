import {
  gcf,
  greatestCommonDivisor,
  leastCommonFactor
} from '../../algorithms/satisgraphtory/splitterSimulation';

class Fraction {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  public toString(rounding: number = 10): string {
    const multiplier = Math.pow(10, rounding);
    return `${Math.round((this.numerator / this.denominator) * multiplier) /
      multiplier}`;
  }

  public mutateMultiply(fraction: Fraction) {
    const newFraction = this.multiply(fraction);
    const numerator = newFraction.numerator;
    const denominator = newFraction.denominator;

    this.numerator = numerator;
    this.denominator = denominator;
    return this;
  }

  public multiply(fraction: Fraction) {
    const numerator = fraction.numerator;
    const denominator = fraction.denominator;

    const newNumerator = this.numerator * numerator;
    const newDenominator = this.denominator * denominator;
    const common = gcf([newNumerator, newDenominator]);

    return new Fraction(newNumerator / common, newDenominator / common);
  }

  toNumber() {
    return this.numerator / this.denominator;
  }

  reduce() {
    const gcd = greatestCommonDivisor(this.numerator, this.denominator);
    return new Fraction(this.numerator / gcd, this.denominator / gcd);
  }

  add(fraction: Fraction) {
    const numerator1 = this.numerator;
    const denominator1 = this.denominator;

    const numerator2 = fraction.numerator;
    const denominator2 = fraction.denominator;

    const commonDenominator = leastCommonFactor(denominator1, denominator2);
    const factor1 = (numerator1 * commonDenominator) / denominator1;
    const factor2 = (numerator2 * commonDenominator) / denominator2;

    return new Fraction(factor1 + factor2, commonDenominator).reduce();
  }

  subtract(fraction: Fraction) {
    const negativeFrac = new Fraction(
      -1 * fraction.numerator,
      fraction.denominator
    );
    return this.add(negativeFrac);
  }

  mutateSubtract(fraction: Fraction) {
    const result = this.subtract(fraction);
    this.numerator = result.numerator;
    this.denominator = result.denominator;
    return this;
  }

  mutateAdd(fraction: Fraction) {
    const result = this.add(fraction);
    this.numerator = result.numerator;
    this.denominator = result.denominator;
    return this;
  }

  mutateReduce() {
    const reduced = this.reduce();
    this.numerator = reduced.numerator;
    this.denominator = reduced.denominator;
    return this;
  }

  public mutateDivide(fraction: Fraction) {
    this.mutateMultiply(new Fraction(fraction.denominator, fraction.numerator));
    return this;
  }

  public divide(fraction: Fraction) {
    return this.multiply(
      new Fraction(fraction.denominator, fraction.numerator)
    );
  }

  reciprocal() {
    return new Fraction(this.denominator, this.numerator);
  }

  public max(fraction: Fraction) {
    if (this.toNumber() < fraction.toNumber()) {
      return fraction;
    }

    return this;
  }

  public min(fraction: Fraction) {
    if (this.toNumber() > fraction.toNumber()) {
      return fraction;
    }

    return this;
  }
}

export default Fraction;
