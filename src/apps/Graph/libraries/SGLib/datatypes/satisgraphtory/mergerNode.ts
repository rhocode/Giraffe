import BalancedPropagatorNode from './balancedPropagatorNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';

export default class MergerNode extends BalancedPropagatorNode {
  distributeOutputs(): void {
    const input = Array.from(this.resourceIn.values()).flat(1);

    // const inputRate = ResourceRate.getTotalItemRate(input);

    const outputBelts = Array.from(this.outputs.keys()).map(item => {
      if (!(item instanceof Belt)) {
        throw new Error('Not a belt!');
      }
      return item as Belt;
    });

    // const speeds = outputBelts.map(belt => belt.getSpeedInItemsPerSecond());

    const reducedRate = ResourceRate.collect(input);

    outputBelts.forEach(belt => {
      reducedRate.forEach(resource => {
        belt.addResource(this, resource);
        //TODO: clear belt first?
      });
    });

    //TODO: figure out if the merger cannot handle too many inputs
  }

  processInputs(blacklist: Set<Belt> = new Set()): void {
    super.processInputs(blacklist);
  }
}
