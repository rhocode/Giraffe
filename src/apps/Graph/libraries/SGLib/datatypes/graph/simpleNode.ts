import SimpleEdge from './simpleEdge';

type Nullable<T> = T | null;

export default class SimpleNode {
  data: Nullable<Object>;
  endpoint: boolean;
  inputs: Map<SimpleEdge, SimpleNode> = new Map();
  outputs: Map<SimpleEdge, SimpleNode> = new Map();
  internalDescriptor: String = '';

  isClusterBoundary: boolean = false;

  static readonly NULL_NODE = new SimpleNode(null);

  constructor(data: Nullable<Object>, endpoint: boolean = false) {
    this.data = data;
    this.endpoint = endpoint;
  }

  setClusterBoundary(isClusterBoundary: boolean = true) {
    this.isClusterBoundary = isClusterBoundary;
  }

  setInternalDescriptor(desc: String) {
    this.internalDescriptor = desc;
    return this;
  }

  addOutput(
    target: SimpleNode,
    dedupe: boolean = false,
    constructorClass = SimpleEdge,
    edgeData: any = null
  ): SimpleEdge {
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

    const newEdge = new constructorClass(edgeData, this, target);
    this.outputs.set(newEdge, target);
    target.inputs.set(newEdge, this);
    return newEdge;
  }

  addInput(
    source: SimpleNode,
    constructorClass = SimpleEdge,
    edgeData: any = null
  ): SimpleEdge {
    const newEdge = new constructorClass(edgeData, source, this);
    this.inputs.set(newEdge, source);
    source.outputs.set(newEdge, this);
    return newEdge;
  }
}
