import { GraphNode } from './graphNode';

type Nullable<T> = T | null;
type ManualEdgeData = {
  id: number;
  sourceIndex: number;
  targetIndex: number;
};

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
  speedEnum: string;

  constructor(
    source: GraphNode,
    target: GraphNode,
    speed_enum: string = 'mk1',
    manualCreation: boolean = false,
    manualData: ManualEdgeData
  ) {
    if (!manualCreation) {
      this.sourceNode = source;
      this.targetNode = target;
      this.source = source.id;
      this.target = target.id;
      this.id = GraphEdge.nextEdgeId++;
      source.addTarget(this);
      target.addSource(this);
      this.speedEnum = speed_enum;
    } else {
      this.sourceNode = source;
      this.targetNode = target;
      this.source = source.id;
      this.target = target.id;

      if (manualData.id === undefined) {
        this.id = GraphEdge.nextEdgeId++;
      } else {
        this.id = manualData.id;
        if (GraphEdge.nextEdgeId <= this.id) {
          GraphEdge.nextEdgeId = this.id + 1;
        }
      }

      this.speedEnum = speed_enum;

      source.addTargetAtIndex(this, manualData.sourceIndex);
      target.addSourceAtIndex(this, manualData.targetIndex);
    }
  }

  updateCoordinates() {
    const target = this.targetNode;
    const source = this.sourceNode;

    const outputSlot = source.outputSlotMapping[
      source.outputSlots.indexOf(this)
    ] || { x: 0, y: 0 };

    const inputSlot = target.inputSlotMapping[
      target.inputSlots.indexOf(this)
    ] || { x: 0, y: 0 };

    const x1 = source.fx + outputSlot.x;
    const y1 = source.fy + outputSlot.y;
    const x2 = target.fx + inputSlot.x;
    const y2 = target.fy + inputSlot.y;

    this.setCoordinatesInternal(x1, x2, y1, y2);
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
    const x1 = this.x1;
    const y1 = this.y1;
    const x2 = this.x2;
    const y2 = this.y2;
    const avg = (x1 + x2) / 2;

    drawnContext.beginPath();
    drawnContext.strokeStyle = color;
    drawnContext.lineWidth = width;

    drawnContext.moveTo(x1, y1);
    drawnContext.bezierCurveTo(avg, y1, avg, y2, x2, y2);
    drawnContext.stroke();
  }

  private setCoordinatesInternal(
    x1: number,
    x2: number,
    y1: number,
    y2: number
  ) {
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

    return (
      lowerXRect <= lowerX &&
      upperX <= upperXRect &&
      (lowerYRect <= lowerY && upperY <= upperYRect)
    );
  }
}
