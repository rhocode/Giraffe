import SimpleEdge from './simpleEdge';
import ResourcePacket from './primitives/resourcePacket';

type Nullable<T> = T | null;

export default class SimpleNode {
  data: Nullable<Object>;
  endpoint: boolean;
  inputs: Map<SimpleEdge, SimpleNode> = new Map();
  outputs: Map<SimpleEdge, SimpleNode> = new Map();
  demands: Array<ResourcePacket> = [];
  isClusterBoundary: boolean = false;

  constructor(data: Nullable<Object>, endpoint: boolean = false) {
    this.data = data;
    this.endpoint = endpoint;
  }

  setClusterBoundary(isClusterBoundary: boolean = true) {
    this.isClusterBoundary = isClusterBoundary;
  }

  setDemand(demands: Array<ResourcePacket>) {
    this.demands = demands;
  }

  addOutput(target: SimpleNode, dedupe: boolean = false): SimpleEdge {
    if (dedupe) {
      if (Array.from(this.outputs.values()).includes(target)) {
        const locator = Array.from(this.outputs.entries()).filter(entry => {
          return entry[1] === target;
        });

        if (locator.length === 1) {
          return locator[0][0];
        }

        throw new Error('Unable to dedupe SimpleNode');
      }
    }

    const newEdge = new SimpleEdge(null, this, target);
    this.outputs.set(newEdge, target);
    target.inputs.set(newEdge, this);
    return newEdge;
  }

  addInput(source: SimpleNode): SimpleEdge {
    const newEdge = new SimpleEdge(null, source, this);
    this.inputs.set(newEdge, source);
    source.outputs.set(newEdge, this);
    return newEdge;
  }
}
