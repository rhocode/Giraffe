import memoizedSplitterCalculator from './splitterSimulation';

it('calculates the splitter', () => {
  const beltOutputs = [120, 60, 270];
  const beltInputs = 800;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
