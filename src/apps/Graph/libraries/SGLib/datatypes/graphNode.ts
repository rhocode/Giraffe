import {defaultNodeThemeSprite, drawPath} from '../themes/nodeStyle';

type Nullable<T> = T | null;

export abstract class GraphNode {
  static nextMachineNodeId: number = 0;
  id: number;
  fx: number;
  fy: number;
  x: number;
  y: number;
  selected: boolean = false;
  inputSlots: Nullable<GraphNode>[] = [];
  outputSlots: Nullable<GraphNode>[] = [];
  canvas: any;
  context: any;
  zoomedCanvas: any;
  zoomedContext: any;
  abstract width: number;
  abstract height: number;
  abstract xRenderBuffer: number;
  abstract yRenderBuffer: number;
  k: number = 1;

  // These are filled in during render time to cache the assigned output slots
  inputSlotMapping: any = {};
  outputSlotMapping: any = {};

  protected constructor(x: number, y: number) {
    this.id = GraphNode.nextMachineNodeId++;
    this.fx = x;
    this.fy = y;
    this.x = x;
    this.y = y;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.zoomedCanvas = document.createElement('canvas');
    this.zoomedContext = this.zoomedCanvas.getContext('2d');
    this.preRender();
  }

  serialize() {
    return {
      id: this.id,
      fx: this.fx,
      fy: this.fy,
      inputSlots: this.inputSlots,
      outputSlots: this.outputSlots
    }
  };

  isInBoundingBox(x: number, y: number) {
    const lowerX = this.fx + this.xRenderBuffer;
    const upperX = this.fx + this.width;
    const lowerY = this.fy + this.yRenderBuffer;
    const upperY = this.fy + this.height;

    return (lowerX <= x && x <= upperX) && (lowerY <= y && y <= upperY)
  }

  abstract render(context: any, transform: any): void;
  abstract lowRender(context: any): void;

  preRender(transform: any = null): void {
    const transformObj = transform || {k: 1};
    this.canvas.width = (this.width + (2 * this.xRenderBuffer)) * transformObj.k;
    this.canvas.height = (this.height + (2 * this.yRenderBuffer)) * transformObj.k;
    this.zoomedCanvas.width = (this.width + (2 * this.xRenderBuffer)) * 10;
    this.zoomedCanvas.height = (this.height + (2 * this.yRenderBuffer)) * 10;
    if (transform) {
      this.context.scale(transform.k, transform.k);
    }
  }

  addSource(source: GraphNode) {
    const nextNullIndex: number = this.inputSlots.indexOf(null);
    if (nextNullIndex === -1) {
      throw new Error(`GraphNode ${this.id} is full of inputSlots and cannot add ${source.id}`);
    }

    this.inputSlots[nextNullIndex] = source;
  }

  addTarget(target: GraphNode) {
    const nextNullIndex: number = this.outputSlots.indexOf(null);
    if (nextNullIndex === -1) {
      throw new Error(`GraphNode ${this.id} is full of outputSlots and cannot add ${target.id}`);
    }

    this.outputSlots[nextNullIndex] = target;
  }

  sortOutputSlots = () =>{
    this.outputSlots.sort((a: Nullable<GraphNode>, b: Nullable<GraphNode>): number => {
      if (b === null) {
        return -1;
      }
      if (a === null) {
        return 1;
      }

      const yA = a.fy - this.fy;
      const xA = a.fx - this.fx;
      const yB = b.fy - this.fy;
      const xB = b.fx - this.fx;

      return (yA / xA) - (yB / xB);
    })
  };

  sortInputSlots= () =>{
    this.inputSlots.sort((a: Nullable<GraphNode>, b: Nullable<GraphNode>): number => {

      if (b === null) {
        return -1;
      }
      if (a === null) {
        return 1;
      }

      const yA = this.fy - a.fy;
      const xA = this.fx - a.fx;
      const yB = this.fy - b.fy;
      const xB = this.fx - b.fx;

      return (yB / xB) - (yA / xA);
    })
  };

  abstract drawPathToTarget(context: any, target: MachineNode, sourceIndex: number, useIndex: number): void;

  sortSlots = () => {
    this.sortInputSlots();
    this.sortOutputSlots();
  };
}

export default class MachineNode extends GraphNode {
  overclock: number;
  recipeId: number;
  machineId: number;
  width: number = 205;
  height: number = 155;
  xRenderBuffer: number = 15;
  yRenderBuffer: number = 15;


  constructor(machineId: number, overclock: number, recipeId: number, x: number, y: number) {
    super(x, y);
    this.machineId = machineId;
    this.overclock = overclock;
    this.recipeId = recipeId;
    this.inputSlots = [null, null, null];
    this.outputSlots = [null, null, null];
  }

  drawPathToTarget(context: any, target: MachineNode, sourceIndex: number, useIndex: number = 0): void {
    drawPath(context, this, target, sourceIndex, useIndex);
  }

  serialize() {
    return {
      ...super.serialize(),
      overclock: this.overclock,
      recipeId: this.recipeId,
      machineId: this.machineId
    }
  }

  preRender(transform: any, debugContext: any =  this.context): void {
    debugContext.save();
    this.zoomedContext.save();
    super.preRender(transform);
    defaultNodeThemeSprite(debugContext, this);

    this.zoomedContext.scale(10, 10);
    defaultNodeThemeSprite(this.zoomedContext, this);

    this.zoomedContext.restore();
    debugContext.restore();
  }

  lowRender(context: any): void {
    context.save();
    context.drawImage(this.zoomedCanvas, this.fx, this.fy, this.canvas.width, this.canvas.height);
    context.restore();
  }

  render(context: any, transform: any): void {
    context.save();
    context.drawImage(this.canvas, this.fx * transform.k, this.fy * transform.k);
    context.restore();
  }
}