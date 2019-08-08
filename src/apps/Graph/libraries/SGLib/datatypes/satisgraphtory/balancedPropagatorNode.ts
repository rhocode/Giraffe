import SatisGraphtoryLoopableNode from './satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Belt from './belt';

// Used for splitters and mergers (although not smart splitters)
export default class BalancedPropagatorNode extends SatisGraphtoryLoopableNode {
  isClusterBoundary: boolean = false;
  distributeOutputs(): void {}

  processInputs(): void {}

  distributePresentOutputs(
    nodeSubset: Array<SatisGraphtoryAbstractNode>
  ): void {}

  processPresentInputs(nodeSubset: Set<SatisGraphtoryAbstractNode>): void {
    Array.from(this.inputs.entries())
      .filter(entry => {
        const node = entry[1];
        if (!(node instanceof SatisGraphtoryAbstractNode)) {
          throw new Error('not a SatisGraphtoryAbstractNode!');
        }
        return nodeSubset.has(node as SatisGraphtoryAbstractNode);
      })
      .map(entry => entry[0])
      .map(possibleBelt => {
        if (!(possibleBelt instanceof Belt)) {
          throw new Error('not a belt!');
        }
        return possibleBelt as Belt;
      })
      .forEach(belt => {
        Array.from(belt.resources.values()).forEach(resources => {
          resources.forEach(resource => {
            this.addResource(belt, resource);
          });
        });
      });
  }

  // if (this.inputs.size > this.outputs.size) {
  //   // this is a merger
  // } else {
  //   // splitter!
  // }
}
