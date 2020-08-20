export declare type Comparator<T> = (a: T, b: T) => number;
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
  private _length;
  readonly length: number;
  private strategy;
  constructor(options: Options<T>);
  queue(value: T): void;
  dequeue(): T;
  peek(): T;
  clear(): void;
}
