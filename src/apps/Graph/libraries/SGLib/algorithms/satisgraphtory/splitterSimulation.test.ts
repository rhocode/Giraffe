import memoizedSplitterCalculator from './splitterSimulation';
import * as math from 'mathjs';

it('calculates the splitter', () => {
  const blockedUntil = [0, 0, 0] as any;
  let beltIndex = 1;
  const inputSpeeds = [60, 120, 270];
  const outputSpeed = 480;

  const tickSpeed = math.min(math.sum(...inputSpeeds), outputSpeed);

  const speeds = inputSpeeds.map((item) => math.fraction(60, item));

  const tickRate = math.fraction(60, tickSpeed);
  for (let i = 0; i < 20; i++) {
    const currentTime = math.multiply(i, tickRate);
    if (blockedUntil[beltIndex] <= currentTime) {
      blockedUntil[beltIndex] = math.add(currentTime, speeds[beltIndex]);
      console.log(beltIndex);
      beltIndex = (beltIndex + 1) % 3;
    } else {
      let bi2 = (beltIndex + 1) % 3;
      let bi3 = (beltIndex + 2) % 3;

      if (speeds[bi3] < speeds[bi2]) {
        const tmp = bi2;
        bi2 = bi3;
        bi3 = tmp;
      }

      if (blockedUntil[bi2] <= currentTime) {
        console.log(bi2);
        blockedUntil[bi2] = math.add(currentTime, speeds[bi2]);
      } else if (blockedUntil[bi3] <= currentTime) {
        console.log(bi3, 'AAAAA', currentTime, blockedUntil[bi2]);
        blockedUntil[bi3] = math.add(currentTime, speeds[bi3]);
      }
    }
  }
});

it('calculates the splitter', () => {
  const beltOutputs = [60, 120, 270];
  const beltInputs = 700;
  const calculation = memoizedSplitterCalculator(beltInputs, beltOutputs);
  expect(calculation).toBeDefined();
  console.error(calculation.actual);
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});

it('calculates the fractional splitter', () => {
  // const beltOutputs = [
  //   new Fraction(300, 10),
  //   new Fraction(2000, 100),
  //   new Fraction(40000, 1000)
  // ];
  // const beltInputs = new Fraction(90, 1);
  // const calculation = memoizedFractionalSplitterCalculator(
  //   beltInputs,
  //   beltOutputs
  // );
  // expect(calculation).toBeDefined();
  // console.error(JSON.stringify(calculation));
  // expect(calculation.actual.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
  // expect(calculation.optimal.originalOutput)
  //   .toEqual(expect.arrayContaining(beltOutputs));
});
