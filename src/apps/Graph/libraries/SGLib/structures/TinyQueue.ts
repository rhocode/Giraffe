export default class TinyQueue<T> {
  data: Array<T> = [];
  length: number;
  compare: Function;

  constructor(data: Array<T> = [], compare = defaultCompare) {
    this.data = data;
    this.length = this.data.length;
    this.compare = compare;

    this.reheapify();
  }

  private updateLength() {
    this.length = this.data.length;
  }

  reheapify(): void {
    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) {
        this.down(i);
      }
    }
  }

  size(): number {
    return this.data.length;
  }

  remove(item: T) {
    spliceUtil(this.data, item);
    this.updateLength();
  }

  push(item: T) {
    this.data.push(item);
    this.length++;
    this.up(this.length - 1);
  }

  pop() {
    if (this.length === 0) return undefined;

    const top = this.data[0];
    const bottom = this.data.pop();

    if (bottom === undefined) return undefined;

    this.length--;

    if (this.length > 0) {
      this.data[0] = bottom;
      this.down(0);
    }

    return top;
  }

  peek() {
    if (this.length === 0) return undefined;
    return this.data[0];
  }

  private up(pos: number) {
    const { data, compare } = this;
    const item = data[pos];

    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const current = data[parent];
      if (compare(item, current) >= 0) break;
      data[pos] = current;
      pos = parent;
    }

    data[pos] = item;
  }

  private down(pos: number) {
    const { data, compare } = this;
    const halfLength = this.length >> 1;
    const item = data[pos];

    while (pos < halfLength) {
      let left = (pos << 1) + 1;
      let best = data[left];
      const right = left + 1;

      if (right < this.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;

      data[pos] = best;
      pos = left;
    }

    data[pos] = item;
  }
}

function defaultCompare(a: number, b: number) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export const spliceUtil = function(object: Array<any>, item: any) {
  if (object.indexOf(item) === -1) return;
  object.splice(object.indexOf(item), 1);
};
