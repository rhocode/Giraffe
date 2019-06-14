import {defaultNodeTheme, drawPath} from '../themes/nodeStyle';

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

  // These are filled in during render time to cache the assigned output slots
  inputSlotMapping: any = {};
  outputSlotMapping: any = {};

  protected constructor(x: number, y: number) {
    this.id = GraphNode.nextMachineNodeId++;
    this.fx = x;
    this.fy = y;
    this.x = x;
    this.y = y;
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

  abstract render(context: any, d: any): void;

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

      return (yB/xB) - (yA/xA);
    })
  };

  sortInputSlots= () =>{
    this.outputSlots.sort((a: Nullable<GraphNode>, b: Nullable<GraphNode>): number => {
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

      return (yB/xB) - (yA/xA);
    })
  };

  abstract drawPathToTarget(context: any, target: MachineNode): void;

  sortSlots = () => {
    this.sortInputSlots();
    this.sortOutputSlots();
  };
}

export default class MachineNode extends GraphNode {
  overclock: number;
  recipeId: number;
  machineId: number;


  constructor(machineId: number, overclock: number, recipeId: number, x: number, y: number) {
    super(x, y);
    this.machineId = machineId;
    this.overclock = overclock;
    this.recipeId = recipeId;
    this.inputSlots = [null, null, null];
    this.outputSlots = [null];
  }

  drawPathToTarget(context: any, target: MachineNode): void {
    drawPath(context, this, target);
  }

  serialize() {
    return {
      ...super.serialize(),
      overclock: this.overclock,
      recipeId: this.recipeId,
      machineId: this.machineId
    }
  }

  render(context: any): void {
    defaultNodeTheme(context, this);
  }
}