import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import { memoizedFractionalSplitterCalculator } from '../../algorithms/satisgraphtory/splitterSimulation';
import Fraction from '../primitives/fraction';
import DistributedOutput from './distributedOutput';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import SimpleEdge from '../graph/simpleEdge';

export default class SplitterNode extends BalancedPropagatorNode {
  distributeOutputs() {
    const excessResources: Array<ResourceRate> = [];

    const incomingBelts = Array.from(this.resourceIn.keys());
    const totalBeltInput = incomingBelts
      .map(belt => {
        const rates = belt.getAllResourceRates();
        if (rates.overflowed) {
          excessResources.push(...rates.excessResourceRates);
        }

        return rates.resourceRate;
      })
      .flat(1);

    //TODO: fix excess input rates
    const inputRate = ResourceRate.getTotalItemRate(totalBeltInput);

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

    const beltPackets = actual.beltPackets.map((packet: any) => {
      return {
        qty: packet.qty,
        seconds: packet.seconds.multiply(new Fraction(factor, 1))
      };
    });

    const adjustedInput = actual.adjustedInput;
    const actualInput = adjustedInput.multiply(new Fraction(1, factor));

    const missingInput = inputRate.subtract(actualInput);

    const excess: Map<SimpleEdge, ResourceRate[]> = new Map();

    const allResources = ResourceRate.collect(totalBeltInput);

    const inputBelts = Array.from(this.inputs.keys()).map(item => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    if (missingInput.toNumber() > 0) {
      allResources.forEach(rate => {
        const fractionalResource = rate.fractional(missingInput);

        // console.error('[Splitter] Missing fractional resource', fractionalResource);
        excessResources.push(fractionalResource);
      });
    }

    if (excessResources.length > 0) {
      inputBelts.forEach(belt => {
        excess.set(belt, excessResources);
      });
    }

    outputBelts.forEach((belt, index) => {
      const packet = beltPackets[index];

      const localRate = new Fraction(packet.qty, 1);

      localRate.mutateDivide(packet.seconds);

      // 30/50 or something like that

      if (localRate.numerator > localRate.denominator) {
        throw new Error('This should NEVER be more than 1');
      }

      if (adjustedInput.toNumber() === 0) {
        return new DistributedOutput(
          ResourceRate.numUniqueResources(excessResources) > 1,
          excess
        );

        // ??? TODO: fix this short-circuit?
      }

      //TODO: refactor this shit to be legible?
      belt.clearResources();

      allResources.forEach(rate => {
        const fractionalResource = rate.fractional(localRate);

        // console.error('[Splitter] Adding fractional resource', fractionalResource);
        belt.addResource(this, fractionalResource);
      });
    });

    return new DistributedOutput(
      ResourceRate.numUniqueResources(excessResources) > 1,
      excess
    );
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }

  backPropagation(
    resourceRate: ResourceRate[],
    edge: SimpleEdge
  ): Map<SatisGraphtoryAbstractNode, ResourceRate> {
    throw new Error('Unimplemented!');
    return new Map();
  }
}
