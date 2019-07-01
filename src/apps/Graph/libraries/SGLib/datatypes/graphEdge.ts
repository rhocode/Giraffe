import {GraphNode} from "./graphNode";

type Nullable<T> = T | null;

export abstract class GraphEdge {
  static nextEdgeId: number = 0;
  source: number;
  sourceNode: GraphNode;
  target: number;
  targetNode: GraphNode;
  id: number = 0;
  x1: number = 0;
  x2: number = 0;
  y1: number = 0;
  y2: number = 0;

  protected constructor(source: GraphNode, target: GraphNode) {
    this.sourceNode = source;
    this.targetNode = target;
    this.source = source.id;
    this.target = target.id;
    this.id = GraphEdge.nextEdgeId++;
    source.addTarget(this);
    target.addSource(this);
  }

  public setCoordinates(x1: number, x2: number, y1: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  public intersectsRect(x1: number, y1: number, x2: number, y2: number) {
    const lowerXRect = Math.min(x1, x2);
    const upperXRect = Math.max(x1, x2);
    const lowerYRect = Math.min(y1, y2);
    const upperYRect = Math.max(y1, y2);

    const lowerX = Math.min(this.x1, this.x2);
    const upperX = Math.max(this.x1, this.x2);
    const lowerY = Math.min(this.y1, this.y2);
    const upperY = Math.max(this.y1, this.y2);

    return (lowerXRect <= lowerX && upperX <= upperXRect) && (lowerYRect <= lowerY && upperY <= upperYRect)
  }
}