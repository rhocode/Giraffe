import Fraction from './fraction';

it('Adds a fraction properly', () => {
  const f1 = new Fraction(1, 4);
  const f2 = new Fraction(1, 2);

  const result = f1.add(f2);
  expect(result.numerator).toBe(3);
  expect(result.denominator).toBe(4);
});
