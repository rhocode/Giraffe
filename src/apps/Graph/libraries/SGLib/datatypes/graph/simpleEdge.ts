import SimpleNode from './simpleNode';

type Nullable<T> = T | null;

export default class SimpleEdge {
  data: Nullable<Object>;
  source: SimpleNode;
  target: SimpleNode;
  weight: number = Infinity;

  static readonly NULL_EDGE = new SimpleEdge(
    null,
    SimpleNode.NULL_NODE,
    SimpleNode.NULL_NODE
  );

  static createNullTerminalEdge(data: Nullable<Object>, target: SimpleNode) {
    return new SimpleEdge(data, SimpleNode.NULL_NODE, target);
  }

  constructor(data: Nullable<Object>, source: SimpleNode, target: SimpleNode) {
    this.data = data;
    this.source = source;
    this.target = target;
  }

  isNullEdge() {
    return (
      this.source === SimpleNode.NULL_NODE &&
      this.target === SimpleNode.NULL_NODE
    );
  }

  isFakeEdge() {
    return (
      this.source === SimpleNode.NULL_NODE &&
      this.target !== SimpleNode.NULL_NODE
    );
  }

  setWeight(weight: number) {
    this.weight = weight;
    return this;
  }

  setData(data: Nullable<Object>) {
    this.data = data;
    return this;
  }
}
