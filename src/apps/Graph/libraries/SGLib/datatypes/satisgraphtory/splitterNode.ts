import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import { memoizedFractionalSplitterCalculator } from '../../algorithms/satisgraphtory/splitterSimulation';
import Fraction from '../primitives/fraction';
import DistributedOutput from './distributedOutput';

export default class SplitterNode extends BalancedPropagatorNode {
  distributeOutputs() {
    const input = Array.from(this.resourceIn.values()).flat(1);

    const inputRate = ResourceRate.getTotalItemRate(input);

    const outputBelts = Array.from(this.outputs.keys()).map(item => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    const speeds = outputBelts.map(belt => belt.getSpeedInItemsPerSecond());

    //TODO: Figure out the OPTIMAL configuration
    const calculation = memoizedFractionalSplitterCalculator(inputRate, speeds);

    const { result, factor } = calculation;

    const actual = result.actual;

    const packets = actual.beltPackets;

    actual.beltPackets.forEach((packet: any) => {
      packet.seconds.mutateMultiply(new Fraction(factor, 1));
    });

    const adjustedInput = actual.adjustedInput;
    const actualInput = adjustedInput.multiply(new Fraction(1, factor));

    const missingInput = inputRate.subtract(actualInput);

    const excess: ResourceRate[] = [];

    const allResources = ResourceRate.collect(input);

    allResources.forEach(rate => {
      const fractionalResource = rate.fractional(missingInput);

      console.error('Missing fractional resource', fractionalResource);
      excess.push(fractionalResource);
    });

    outputBelts.forEach((belt, index) => {
      const packet = packets[index];

      const localRate = new Fraction(packet.qty, 1);

      localRate.mutateDivide(packet.seconds);

      // 30/50 or something like that

      if (localRate.numerator > localRate.denominator) {
        throw new Error('This should NEVER be more than 1');
      }

      if (adjustedInput === 0) {
        return new DistributedOutput(false, []);

        // ??? TODO: fix this short-circuit?
      }

      // The below is not needed since everything is now relative.
      // localRate.mutateMultiply(divisor); // this should now be the resource rate that you apply to each input

      //TODO: refactor this shit to be legible?
      belt.clearResources();

      allResources.forEach(rate => {
        const fractionalResource = rate.fractional(localRate);

        console.error('Adding fractional resource', fractionalResource);
        belt.addResource(this, fractionalResource);
      });
    });
    console.error(
      'Splitter output',
      ResourceRate.numUniqueResources(excess) > 1,
      excess
    );
    return new DistributedOutput(
      ResourceRate.numUniqueResources(excess) > 1,
      excess
    );
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }
}
