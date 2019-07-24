const greatestCommonDivisor = (a: number, b: number): number => {
  if (isNaN(a) || isNaN(b)) {
    return 0;
  }

  if (b === 0) return a;
  else return greatestCommonDivisor(b, a % b);
};

const gcf = (list: Array<number>): number => {
  return list.reduce(greatestCommonDivisor);
};

const leastCommonFactor = (a: number, b: number): number => {
  return (a * b) / greatestCommonDivisor(a, b);
};

const leastCommonMultiple = (list: Array<number>): number => {
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

const splitterCalculatorHelper = (
  inputSpeed: number,
  outputsSpeedArray: Array<number>
): any => {
  let belt = 1;
  let blocked = [0, 0, 0];

  const beltOutputReciprocal = outputsSpeedArray.map(i =>
    i === 0 ? Infinity : 60 / i
  );

  const timeScale = 60 / inputSpeed;
  const usedItems = outputsSpeedArray.filter(i => i);
  const scaleMultiplier = leastCommonMultiple([...usedItems, inputSpeed]);

  const sums: { [key: number]: number } = { 0: 0, 1: 0, 2: 0 };
  let i: number = 0;
  let itemsProcessed: number = 0;
  let beltStuckCount: number = 0;

  const checkedSequence = [];
  let readyToCheck = false;
  const usedItemsLength = usedItems.length;
  let iterator = 0;
  while (iterator < 1000) {
    iterator++;
    let lastBeltUsed = -1;
    let time = Math.round(i * timeScale * scaleMultiplier);
    let beltChanged = false;

    for (let i = 0; i < usedItemsLength; i++) {
      if (outputsSpeedArray[belt]) {
        const isBeltBlocked = blocked[belt] > time;

        if (!isBeltBlocked) {
          blocked[belt] =
            time + Math.round(beltOutputReciprocal[belt] * scaleMultiplier);
          sums[belt] += 1;
          // print("Belt %d is unlocked, pushing. Next time is %d" %(belt, blocked[belt]), end =" ")
          lastBeltUsed = belt;
          belt = (belt + 1) % 3;
          itemsProcessed += 1;
          beltChanged = true;
          break;
        }
      }

      belt = (belt + 1) % 3;
    }

    if (!beltChanged) {
      beltStuckCount += 1;
    }

    if (i >= usedItemsLength) {
      if (lastBeltUsed !== -1) {
        checkedSequence.push(lastBeltUsed);
      }
      // timeList.push(time);
    }

    if (i >= usedItemsLength) {
      if (!readyToCheck) {
        readyToCheck = Object.values(sums)
          .map(i => i >= 2)
          .every(i => i);
      }

      if (readyToCheck && checkedSequence.length % 2 !== 1) {
        const [left, right] = splitList(checkedSequence);

        if (JSON.stringify(left) === JSON.stringify(right)) {
          i += 1;
          break;
        }
      }
    }
    i += 1;
  }

  i -= 1;

  const [left] = splitList(checkedSequence);

  const totalTime = timeScale * left.length;

  const adjustedInput = left.filter(i => i !== -1).length / totalTime;
  // console.log(adjustedInput * 60, (left.length) / (timeScale * left.length) * 60);

  const leftSplit = left.filter(i => i === 0).length;
  const middleSplit = left.filter(i => i === 1).length;
  const rightSplit = left.filter(i => i === 2).length;
  const beltOutputs = [
    (leftSplit * 60) / totalTime,
    (middleSplit * 60) / totalTime,
    (rightSplit * 60) / totalTime
  ];

  const maxSpeed = Math.max(...outputsSpeedArray);

  const manifoldOutput = outputsSpeedArray.map(speed => {
    if (speed === maxSpeed) {
      const multiplier = Math.ceil(1 / speed / (1 / inputSpeed));

      return inputSpeed / multiplier;
    }

    return speed;
  });

  const manifoldInput = manifoldOutput.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );

  return {
    timeScale,
    sequence: left,
    adjustedInput: adjustedInput * 60,
    beltOutputs,
    manifoldInput,
    manifoldOutput,
    originalOutput: outputsSpeedArray
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

  const bestOutput = Math.max(...outputted.map(i => i.adjustedInput));

  const choices = outputted
    .filter(i => i.adjustedInput === bestOutput)
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

const memoizedSplitterCalculator = memoizedSplitterCalculatorFunction();

export default memoizedSplitterCalculator;
