import { defaultNodeTheme } from '../themes/nodeStyle';

class GraphNode {}

export default class MachineNode extends GraphNode {
  static nextMachineNodeId: number = 0;
  overclock: number;
  recipeId: number;
  machineId: number;
  machineNodeId: number;

  constructor(machineId: number, overclock: number, recipeId: number) {
    super();
    this.machineId = machineId;
    this.overclock = overclock;
    this.recipeId = recipeId;
    this.machineNodeId = MachineNode.nextMachineNodeId++;
  }

  render(context: any, d: any) {
    defaultNodeTheme(context, d);
  }
}