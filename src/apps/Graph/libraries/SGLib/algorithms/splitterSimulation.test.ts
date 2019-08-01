import memoizedSplitterCalculator from './splitterSimulation';

it('calculates the splitter', () => {
  const beltOutputs = [30, 900, 30];
  const beltInputs = 960;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
