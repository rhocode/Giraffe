import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Belt from './belt';
import ResourceRate from '../primitives/resourceRate';
import DistributedOutput from './distributedOutput';

// Used for splitters and mergers (although not smart splitters)
export default abstract class BalancedPropagatorNode extends SatisGraphtoryLoopableNode {
  isClusterBoundary: boolean = false;
  abstract distributeOutputs(): DistributedOutput;

  processInputs(blacklist: Set<Belt> = new Set()): void {
    Array.from(this.inputs.entries())
      .filter(entry => {
        const node = entry[1];
        const belt = entry[0];
        if (!(node instanceof SatisGraphtoryAbstractNode)) {
          throw new Error('not a SatisGraphtoryAbstractNode!');
        }
        if (!(belt instanceof Belt)) {
          throw new Error('not a Belt!');
        }
        return !blacklist.has(belt);
      })
      .map(entry => entry[0])
      .map(possibleBelt => {
        if (!(possibleBelt instanceof Belt)) {
          throw new Error('not a belt!');
        }
        return possibleBelt as Belt;
      })
      .forEach(belt => {
        const response = belt.getAllResourceRates();
        const { resourceRate } = response;
        //TODO: fix if the resource rate is somehow too much

        const simplifiedRates = ResourceRate.collect(resourceRate);

        simplifiedRates.forEach(resource => {
          //TODO: clear belt first?
          this.addResource(belt, resource);
        });
      });
  }

  distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void {}

  //
  // processPresentInputs(nodeSubset: Set<SatisGraphtoryAbstractNode>): void {
  //   Array.from(this.inputs.entries())
  //     .filter(entry => {
  //       const node = entry[1];
  //       if (!(node instanceof SatisGraphtoryAbstractNode)) {
  //         throw new Error('not a SatisGraphtoryAbstractNode!');
  //       }
  //       return nodeSubset.has(node as SatisGraphtoryAbstractNode);
  //     })
  //     .map(entry => entry[0])
  //     .map(possibleBelt => {
  //       if (!(possibleBelt instanceof Belt)) {
  //         throw new Error('not a belt!');
  //       }
  //       return possibleBelt as Belt;
  //     })
  //     .forEach(belt => {
  //       Array.from(belt.resources.values()).forEach(resources => {
  //         resources.forEach(resource => {
  //           this.addResource(belt, resource);
  //         });
  //       });
  //     });
  // }

  // if (this.inputs.size > this.outputs.size) {
  //   // this is a merger
  // } else {
  //   // splitter!
  // }
}
