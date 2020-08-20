import { QueueStrategy, Options } from './PriorityQueue';
export default class BinaryHeapStrategy<T> implements QueueStrategy<T> {
  private comparator;
  private data;
  constructor(options: Options<T>);
  private _heapify();
  queue(value: T): void;
  dequeue(): T;
  peek(): T;
  clear(): void;
  _bubbleUp(pos: number): void;
  _bubbleDown(pos: number): undefined;
}
