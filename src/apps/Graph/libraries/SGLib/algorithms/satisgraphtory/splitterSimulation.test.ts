import memoizedSplitterCalculator from './splitterSimulation';

it('calculates the splitter', () => {
  const beltOutputs = [30, 20, 40];
  const beltInputs = 90;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
