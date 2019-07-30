import SimpleEdge from './simpleEdge';
import ResourcePacket from './primitives/resourcePacket';

type Nullable<T> = T | null;

export default class SimpleNode {
  data: Nullable<Object>;
  inputs: Map<SimpleEdge, SimpleNode> = new Map();
  outputs: Map<SimpleEdge, SimpleNode> = new Map();
  demands: Array<ResourcePacket> = [];
  isClusterBoundary: boolean = false;

  constructor(data: Nullable<Object>) {
    this.data = data;
  }

  setClusterBoundary(isClusterBoundary: boolean = true) {
    this.isClusterBoundary = isClusterBoundary;
  }

  setDemand(demands: Array<ResourcePacket>) {
    this.demands = demands;
  }

  addOutput(target: SimpleNode): SimpleEdge {
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
