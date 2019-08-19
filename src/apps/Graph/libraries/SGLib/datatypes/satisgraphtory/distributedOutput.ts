import ResourceRate from '../primitives/resourceRate';

export default class DistributedOutput {
  errored: boolean = false;
  excess: Array<ResourceRate> = [];
  constructor(errored: boolean, excess: Array<ResourceRate>) {
    this.errored = errored;
    this.excess = excess;
  }

  hasExcess() {
    return this.excess.length > 0;
  }
}
