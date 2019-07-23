import SimpleNode from './simpleNode';

type Nullable<T> = T | null;

export default class SimpleEdge {
  data: Nullable<Object>;
  source: Nullable<SimpleNode> = null;
  target: Nullable<SimpleNode>;
  max: number = Infinity;
  min: number = -Infinity;
  weight: Nullable<number> = null;

  constructor(
    data: Nullable<Object>,
    source: Nullable<SimpleNode>,
    target: Nullable<SimpleNode>
  ) {
    this.data = data;
    this.source = source;
    this.target = target;
  }

  setMin(min: number) {
    this.min = min;
    this.checkBounds();
  }

  checkBounds() {
    if (this.min === this.max) {
      this.weight = this.min;
    }
  }

  setMax(max: number) {
    this.max = max;
    this.checkBounds();
  }

  setWeight(weight: number) {
    this.weight = weight;
    this.min = weight;
    this.max = weight;
  }

  setSource(source: SimpleNode) {
    this.source = source;
  }

  setTarget(target: SimpleNode) {
    this.target = target;
  }
}
