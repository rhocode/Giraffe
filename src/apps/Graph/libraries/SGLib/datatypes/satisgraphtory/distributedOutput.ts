import ResourceRate from '../primitives/resourceRate';
import SimpleEdge from '../graph/simpleEdge';

export default class DistributedOutput {
  errored: boolean = false;
  excess: Map<SimpleEdge, ResourceRate[]> = new Map();

  constructor(errored: boolean, excess: Map<SimpleEdge, ResourceRate[]>) {
    this.errored = errored;
    this.excess = excess;
  }

  hasExcess() {
    return this.excess.size > 0;
  }
}
