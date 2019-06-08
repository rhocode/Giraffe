import { defaultNodeTheme } from '../themes/nodeStyle';

class GraphNode {}

class MachineNode extends GraphNode {
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

// class MachineArrayNode extends GraphNode {
//     overclock: number;
//     recipeId: number;
//     machineId: number;
//     machineNodeId: number;
//     static nextMachineNodeId: number = 0;
//     constructor(x: number, y: number, machineId: number, overclock: number, recipeId: number) {
//         super(x, y);
//         this.machineId = machineId;
//         this.overclock = overclock;
//         this.recipeId = recipeId;
//         this.machineNodeId = MachineNode.nextMachineNodeId++;
//     }
//
//     render(canvasContext: object) {
//
//     }
// }

export default MachineNode;
