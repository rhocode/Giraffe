import memoizedSplitterCalculator from './splitterSimulation';

it('calculates the splitter', () => {
  const beltOutputs = [60, 120, 270];
  const beltInputs = 810;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  console.error(calculation);
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
