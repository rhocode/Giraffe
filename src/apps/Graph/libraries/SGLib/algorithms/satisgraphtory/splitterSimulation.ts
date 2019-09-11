import Fraction from '../../datatypes/primitives/fraction';

export const greatestCommonDivisor = (a: number, b: number): number => {
  if (isNaN(a) || isNaN(b)) {
    return 0;
  }

  if (b === 0) return a;
  else return greatestCommonDivisor(b, a % b);
};

export const gcf = (list: Array<number>): number => {
  return list.reduce(greatestCommonDivisor);
};

export const leastCommonFactor = (a: number, b: number): number => {
  return (a * b) / greatestCommonDivisor(a, b);
};

export const leastCommonMultiple = (list: Array<number>): number => {
  return list.reduce(leastCommonFactor);
};

const reduceRatio = (ratioList: Array<number>): Array<number> => {
  const denominator = gcf(ratioList);
  return ratioList.map(i => i / denominator);
};

const splitList = (list: Array<number>): Array<Array<number>> => {
  const halfLength = Math.round(list.length / 2);
  return [list.slice(0, halfLength), list.slice(halfLength)];
};

type BeltTuple = {
  left: number;
  top: number;
  right: number;
};

const generateSplitterIterator = (beltSpeeds: BeltTuple) => {
  let index = 0;
  const beltOrder: Array<number> = [];
  const blockedUntil: Array<number> = [];

  const { left, top, right } = beltSpeeds;

  if (top > 0) {
    beltOrder.push(1);
    blockedUntil.push(0);
  }

  if (right > 0) {
    beltOrder.push(2);
    blockedUntil.push(0);
  }

  if (left > 0) {
    beltOrder.push(0);
    blockedUntil.push(0);
  }

  return {
    next: function(): number {
      const returnedIndex = index;
      index = (index + 1) % beltOrder.length;
      return beltOrder[returnedIndex];
    }
  };
};

const fractionalSplitterCalculator = (
  inputSpeed: Fraction,
  outputsSpeed: Array<Fraction>
) => {
  const denominators = [
    inputSpeed.denominator,
    ...outputsSpeed.map(fraction => fraction.denominator)
  ];
  const lcm = leastCommonMultiple(denominators);
  const factor = new Fraction(lcm, 1);
  const fixedInputs = inputSpeed.multiply(factor).reduce();
  const fixedOutputs = outputsSpeed.map(item => item.multiply(factor).reduce());

  [
    fixedInputs.denominator,
    ...fixedOutputs.map(item => item.denominator)
  ].forEach(item => {
    if (item !== 1) {
      throw new Error('Not properly reduced!');
    }
  });

  return {
    result: splitterCalculator(
      fixedInputs.numerator,
      fixedOutputs.map(item => item.numerator)
    ),
    factor: lcm
  };
};

const splitterCalculator = (
  inputSpeed: number,
  outputsSpeed: Array<number>
) => {
  function permutations(xs: Array<number>): Array<Array<number>> {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
      let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));

      if (!rest.length) {
        ret.push([xs[i]]);
      } else {
        for (let j = 0; j < rest.length; j = j + 1) {
          ret.push([xs[i]].concat(rest[j]));
        }
      }
    }
    return ret;
  }

  const outputsPermuted = permutations(outputsSpeed);

  const outputted = outputsPermuted.map(out =>
    splitterCalculatorHelper(inputSpeed, out)
  );

  const bestOutput = Math.max(
    ...outputted.map(i => i.adjustedInput.toNumber())
  );

  const choices = outputted
    .filter(i => i.adjustedInput.toNumber() === bestOutput)
    .sort((setting1: any, setting2: any) => {
      let counter1 = 0;
      let counter2 = 0;
      const setting1Belts = setting1.originalOutput;
      const setting2Belts = setting2.originalOutput;
      outputsSpeed.forEach((speed, index) => {
        if (speed !== setting1Belts[index]) {
          counter1++;
        }

        if (speed !== setting2Belts[index]) {
          counter2++;
        }
      });

      return counter1 - counter2;
    });

  const actual = outputted.filter(i =>
    i.originalOutput.every((element: number, index: number) => {
      return element === outputsSpeed[index];
    })
  )[0];

  return { actual, optimal: choices[0] };
};

const splitterCalculatorHelper = (
  inputSpeed: number,
  outputsSpeed: Array<number>
) => {
  const beltOutputReciprocal = outputsSpeed.map(i =>
    i === 0 ? Infinity : 60 / i
  );

  const timeScale = 60 / inputSpeed;
  const nonZeroItems = outputsSpeed.filter(i => i);
  // const scaleMultiplier = leastCommonMultiple([...nonZeroItems, inputSpeed]);
  const beltIterator = generateSplitterIterator({
    left: outputsSpeed[0],
    top: outputsSpeed[1],
    right: outputsSpeed[2]
  });
  const sequence = [];
  const nextFreeTime = [0, 0, 0];

  const numOutputs = nonZeroItems.length;

  let timeIndex = 0;

  const outputtedItemCount: { [key: number]: number } = {};

  outputsSpeed.forEach((speed, index) => {
    if (speed !== 0) {
      outputtedItemCount[index] = 0;
    }
  });

  let minimumElementsPassed = false;
  // let startRecording = false;
  // let startTime = 0;
  let usedNextFreeTime = false;

  let lcm = leastCommonMultiple([...outputsSpeed].filter(item => item > 0));

  const upperBound = Math.round((lcm + 500) / 1000);

  const iterator = upperBound * 1000;

  while (timeIndex < iterator) {
    const time = timeIndex * timeScale;

    let beltChanged = false;
    usedNextFreeTime = false;

    for (let i = 0; i < numOutputs; i++) {
      const beltIndex = beltIterator.next();
      const beltSpeed = beltOutputReciprocal[beltIndex];
      const beltNextFreeTime = nextFreeTime[beltIndex];
      if (beltNextFreeTime <= time) {
        nextFreeTime[beltIndex] = time + beltSpeed;

        if (timeIndex >= numOutputs) {
          sequence.push(beltIndex);
          outputtedItemCount[beltIndex]++;
        }

        beltChanged = true;
        break;
      }
    }

    if (!beltChanged) {
      // Check the next time we are able to propagate a "stuck" item.
      const nextTime = (timeIndex + 1) * timeScale;

      for (let i = 0; i < numOutputs; i++) {
        const beltIndex = beltIterator.next();
        const beltSpeed = beltOutputReciprocal[beltIndex];
        const beltNextFreeTime = nextFreeTime[beltIndex];
        if (beltNextFreeTime < nextTime) {
          nextFreeTime[beltIndex] = beltNextFreeTime + beltSpeed;

          if (timeIndex + 1 >= numOutputs) {
            sequence.push(beltIndex);
            outputtedItemCount[beltIndex]++;
          }
          usedNextFreeTime = true;
          break;
        }
      }
    }

    if (!minimumElementsPassed) {
      minimumElementsPassed = Object.values(outputtedItemCount)
        .map(i => i >= 2)
        .every(i => i);
    }

    if (minimumElementsPassed && sequence.length % 2 === 0) {
      const [left, right] = splitList(sequence);
      if (JSON.stringify(left) === JSON.stringify(right)) {
        break;
      }
    }

    timeIndex++;
  }

  if (usedNextFreeTime) {
    timeIndex++;
  }

  const [left] = splitList(sequence);

  const totalTime = ((timeIndex - nonZeroItems.length + 1) / 2) * timeScale;

  // const itemsTransported = left.filter(i => i >= 0).length;

  const leftSplit = left.filter(i => i === 0).length;
  const middleSplit = left.filter(i => i === 1).length;
  const rightSplit = left.filter(i => i === 2).length;
  const beltOutputs = [
    (leftSplit * 60) / totalTime,
    (middleSplit * 60) / totalTime,
    (rightSplit * 60) / totalTime
  ];

  //TODO: should mult by 60?
  const numerator = timeIndex - nonZeroItems.length + 1;
  const denominator = 2 * inputSpeed;
  const [reducedNumerator, reducedDenominator] = reduceRatio([
    numerator,
    denominator
  ]);

  const totalTimeFraction = new Fraction(reducedNumerator, reducedDenominator);

  const beltPackets = [
    { qty: leftSplit, seconds: totalTimeFraction.reduce() },
    { qty: middleSplit, seconds: totalTimeFraction.reduce() },
    { qty: rightSplit, seconds: totalTimeFraction.reduce() }
  ];

  const adjustedInput = new Fraction(0, 1);
  beltPackets.forEach(item => {
    const qty = item.qty;
    const seconds = totalTimeFraction;
    const thisFraction = new Fraction(qty, 1);
    thisFraction.mutateDivide(seconds);

    adjustedInput.mutateAdd(thisFraction);
  });

  return {
    timeScale,
    sequence: left,
    adjustedInput, //or (itemsTransported * 60) / totalTime,
    beltOutputs,
    beltPackets,
    // // manifoldInput,
    // // manifoldOutput,
    originalOutput: outputsSpeed
  };
};

const memoizedSplitterCalculatorFunction = (): any => {
  const inputMemo: { [key: string]: any } = {};
  return (inputSpeed: number, outputsSpeed: Array<number>) => {
    const key = `${inputSpeed}:${outputsSpeed}`;
    if (inputMemo[key]) {
      return inputMemo[key];
    } else {
      inputMemo[key] = splitterCalculator(inputSpeed, outputsSpeed);
      return inputMemo[key];
    }
  };
};

const memoizedFractionalSplitterCalculatorFunction = () => {
  const inputMemo: { [key: string]: any } = {};
  return (inputSpeed: Fraction, outputsSpeed: Array<Fraction>) => {
    const resultArray = [
      new Fraction(0, 1),
      new Fraction(0, 1),
      new Fraction(0, 1)
    ];

    outputsSpeed.forEach((item, index) => {
      resultArray[index] = item;
    });

    const key = `${inputSpeed}:${resultArray}`;
    if (inputMemo[key]) {
      return inputMemo[key];
    } else {
      inputMemo[key] = fractionalSplitterCalculator(inputSpeed, resultArray);
      return inputMemo[key];
    }
  };
};

const memoizedSplitterCalculator = memoizedSplitterCalculatorFunction();
export const memoizedFractionalSplitterCalculator = memoizedFractionalSplitterCalculatorFunction();

export default memoizedSplitterCalculator;
