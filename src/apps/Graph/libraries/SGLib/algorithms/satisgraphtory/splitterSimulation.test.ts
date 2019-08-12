import memoizedSplitterCalculator, {
  memoizedFractionalSplitterCalculator
} from './splitterSimulation';
import Fraction from '../../datatypes/primitives/fraction';

it('calculates the splitter', () => {
  const beltOutputs = [30, 20, 40];
  const beltInputs = 90;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  expect(calculation).toBeDefined();
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});

it('calculates the fractional splitter', () => {
  const beltOutputs = [
    new Fraction(300, 10),
    new Fraction(2000, 100),
    new Fraction(40000, 1000)
  ];
  const beltInputs = new Fraction(90, 1);
  const calculation = memoizedFractionalSplitterCalculator(
    beltInputs,
    beltOutputs
  );
  expect(calculation).toBeDefined();
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
