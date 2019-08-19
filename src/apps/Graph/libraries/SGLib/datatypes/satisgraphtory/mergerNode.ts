import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import DistributedOutput from './distributedOutput';

export default class MergerNode extends BalancedPropagatorNode {
  distributeOutputs() {
    const input = Array.from(this.resourceIn.values()).flat(1);

    // const inputRate = ResourceRate.getTotalItemRate(input);

    const outputBelts = Array.from(this.outputs.keys()).map(item => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    const reducedRate = ResourceRate.collect(input);

    outputBelts.forEach(belt => {
      belt.clearResources();
      reducedRate.forEach(resource => {
        belt.addResource(this, resource);
        //TODO: clear belt first?
      });
    });

    let isError = false;
    const excess: Array<ResourceRate> = [];

    outputBelts.forEach(belt => {
      console.error(JSON.stringify(Array.from(belt.resources.values())));

      const {
        excessResourceRates,
        overflowed,
        errored
      } = belt.getAllResourceRates();

      isError = isError || errored;
      if (overflowed && !errored) {
        excess.push(...excessResourceRates);
      }
    });
    console.error('Merger output', isError, excess);
    return new DistributedOutput(isError, excess);
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }
}
