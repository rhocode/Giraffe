import SimpleNode from './simpleNode';

type Nullable<T> = T | null;

export default class SimpleEdge {
  data: Nullable<Object>;
  source: SimpleNode;
  target: SimpleNode;
  weight: number = Infinity;

  constructor(data: Nullable<Object>, source: SimpleNode, target: SimpleNode) {
    this.data = data;
    this.source = source;
    this.target = target;
  }

  setWeight(weight: number) {
    this.weight = weight;
  }
}
