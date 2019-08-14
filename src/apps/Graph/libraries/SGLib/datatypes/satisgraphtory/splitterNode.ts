import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import { memoizedFractionalSplitterCalculator } from '../../algorithms/satisgraphtory/splitterSimulation';
import Fraction from '../primitives/fraction';

export default class SplitterNode extends BalancedPropagatorNode {
  distributeOutputs(): void {
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

    const { result } = calculation;
    // Not needed since it is now relative
    // {factor}
    const actual = result.actual;

    const packets = actual.beltPackets;

    //This is not required since it is now relative
    // const divisor = new Fraction(1, factor);

    const adjustedInput = actual.adjustedInput;

    // TODO: check if adjustedInput is matching to the throughput of this node :(

    const allResources = ResourceRate.collect(input);

    outputBelts.forEach((belt, index) => {
      const packet = packets[index];
      const localRate = new Fraction(packet.qty, 1);
      localRate.mutateDivide(
        new Fraction(packet.seconds.numerator, packet.seconds.denominator)
      );
      // 30/50 or something like that

      if (localRate.numerator > localRate.denominator) {
        throw new Error('This should NEVER be more than 1');
      }

      if (adjustedInput === 0) {
        return; // ??? TODO: fix this short-circuit?
      }

      localRate.mutateDivide(new Fraction(adjustedInput, 1)); // this gets a fractional portion

      // The below is not needed since everything is now relative.
      // localRate.mutateMultiply(divisor); // this should now be the resource rate that you apply to each input

      //TODO: refactor this shit to be legible?

      allResources.forEach(rate => {
        const fractionalResource = rate.fractional(localRate);
        // console.error('Adding to this belt', fractionalResource);
        belt.addResource(this, fractionalResource);
        //TODO: clear belt first?
      });
    });

    //TODO: figure out if the splitter cannot handle too many inputs
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }
}
