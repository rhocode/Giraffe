import BinaryHeapStrategy from './BinaryHeapStrategy';

export type Comparator<T> = (a: T, b: T) => number;

export interface Options<T> {
  comparator: Comparator<T>;
  initialValues?: T[];
}

export interface QueueStrategy<T> {
  queue(value: T): void;
  dequeue(): T;
  peek(): T;
  clear(): void;
}

export default class PriorityQueue<T> {
  private _length: number = 0;
  public get length() {
    return this._length;
  }

  private strategy: QueueStrategy<T>;

  public constructor(options: Options<T>) {
    this._length = options.initialValues ? options.initialValues.length : 0;
    this.strategy = new BinaryHeapStrategy(options);
  }

  public queue(value: T) {
    this._length++;
    this.strategy.queue(value);
  }

  public dequeue() {
    if (!this._length) throw new Error('Empty queue');
    this._length--;
    return this.strategy.dequeue();
  }

  public peek() {
    if (!this._length) throw new Error('Empty queue');
    return this.strategy.peek();
  }

  public clear() {
    this._length = 0;
    this.strategy.clear();
  }
}
