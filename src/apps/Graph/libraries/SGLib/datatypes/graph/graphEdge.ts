import { GraphNode } from './graphNode';

type Nullable<T> = T | null;

export class GraphEdge {
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
  speedEnum: string = 'MK1';

  constructor(
    source: GraphNode,
    target: GraphNode,
    speed_enum: string = 'MK1'
  ) {
    this.sourceNode = source;
    this.targetNode = target;
    this.source = source.id;
    this.target = target.id;
    this.id = GraphEdge.nextEdgeId++;
    source.addTarget(this);
    target.addSource(this);
    this.speedEnum = speed_enum;
  }

  public setCoordinates(x1: number, x2: number, y1: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  serialize() {
    return {
      id: this.id,
      tier: this.speedEnum,
      sourceNodeId: this.source,
      targetNodeId: this.target
    };
  }

  public paintEdge(
    drawnContext: any,
    color: string = '#7122D5',
    width: number = 8
  ) {
    const target = this.targetNode;
    const source = this.sourceNode;

    const outputSlot =
      source.outputSlotMapping[source.outputSlots.indexOf(this)];

    const inputSlot = target.inputSlotMapping[target.inputSlots.indexOf(this)];

    const x1 = source.fx + outputSlot.x;
    const y1 = source.fy + outputSlot.y;
    const x2 = target.fx + inputSlot.x;
    const y2 = target.fy + inputSlot.y;
    const avg = (x1 + x2) / 2;
    this.setCoordinates(x1, x2, y1, y2);
    drawnContext.beginPath();
    drawnContext.strokeStyle = color;
    drawnContext.lineWidth = width;

    drawnContext.moveTo(x1, y1);
    drawnContext.bezierCurveTo(avg, y1, avg, y2, x2, y2);
    drawnContext.stroke();
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

    return (
      lowerXRect <= lowerX &&
      upperX <= upperXRect &&
      (lowerYRect <= lowerY && upperY <= upperYRect)
    );
  }
}
