import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import DistributedOutput from './distributedOutput';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import SimpleEdge from '../graph/simpleEdge';
import Fraction from '../primitives/fraction';
import { memoizedFractionalSplitterCalculator } from '../../algorithms/satisgraphtory/splitterSimulation';

export default class MergerNode extends BalancedPropagatorNode {
  distributeOutputs() {
    const incomingBelts = Array.from(this.resourceIn.keys());

    const excess: Map<SimpleEdge, ResourceRate[]> = new Map();

    let errored = false;

    const totalBeltInput = incomingBelts.map((belt) => {
      const rates = belt.getAllResourceRates();

      errored = errored || rates.errored;

      if (rates.overflowed) {
        excess.set(belt, [...rates.excessResourceRates]);
      }

      return rates.resourceRate;
    });

    const inputRates = totalBeltInput.map((rates) => {
      return ResourceRate.getTotalItemRate(rates);
    });

    const inputBelts = Array.from(this.inputs.keys()).map((item) => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    const outputBelts = Array.from(this.outputs.keys()).map((item) => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    const speeds = outputBelts.map((belt) => belt.getSpeedInItemsPerSecond());

    if (speeds.length > 1) {
      throw new Error('Not a merger, has multiple speeds');
    }

    const outputRate = speeds.length === 0 ? new Fraction(0, 1) : speeds[0];

    // Using reverse splitter calculations!
    const calculation = memoizedFractionalSplitterCalculator(
      outputRate,
      inputRates
    );

    const { result, factor } = calculation;

    const actual = result.actual;

    const packets = actual.beltPackets;

    const beltPackets = packets.map((packet: any) => {
      return {
        qty: packet.qty,
        seconds: packet.seconds.multiply(new Fraction(factor, 1)),
      };
    });

    const adjustedOutput = actual.adjustedInput;
    const actualOutput = adjustedOutput.multiply(new Fraction(1, factor));

    const allResources = ResourceRate.collect(totalBeltInput.flat(1));

    inputBelts.forEach((belt, index) => {
      const packet = beltPackets[index];

      const localRate = new Fraction(packet.qty, 1);

      localRate.mutateDivide(packet.seconds);

      // 30/50 or something like that

      if (localRate.numerator > localRate.denominator) {
        throw new Error('This should NEVER be more than 1');
      }

      if (adjustedOutput.toNumber() === 0) {
        // TODO: fix this short circuit?
        return new DistributedOutput(errored, excess);
      }

      const thisBelt = inputRates[index];

      const missingInput = thisBelt.subtract(localRate);

      if (missingInput.toNumber() > 0) {
        allResources.forEach((rate) => {
          const fractionalResource = rate.fractional(missingInput);
          // console.error('[Merger] Overflow of fractional resource', fractionalResource);

          const existingArr = excess.get(belt) || [];

          existingArr.push(fractionalResource);

          excess.set(belt, existingArr);
        });
      }
    });

    const summedInputRates = new Fraction(0, 1);

    inputRates.forEach((rate) => {
      summedInputRates.mutateAdd(rate);
    });

    // Fix output belts

    const presentOutput = actualOutput.divide(summedInputRates);

    if (outputBelts.length > 1) {
      throw new Error('There are multiple output belts!');
    }

    // there's only one belt.
    outputBelts.forEach((belt) => {
      // push output to the belt!
      allResources.forEach((rate) => {
        const fractionalResource = rate.fractional(presentOutput);

        // console.error('[Merger] Adding fractional resource', fractionalResource);
        belt.addResource(this, fractionalResource);
      });
    });

    return new DistributedOutput(errored, excess);
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }

  backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    // return new Map();
  }
}
