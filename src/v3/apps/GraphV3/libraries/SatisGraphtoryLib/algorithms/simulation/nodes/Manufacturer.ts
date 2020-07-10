import Simulatable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable';
// import Slot from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/shared/Slot";
// import Recipe from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/objects/Recipe";

export default class Manufacturer implements Simulatable {
  // private inputSlots: Slot[];
  // private outputSlots: Slot[];

  private currentInputSlotIndex = 0;
  private currentOutputSlotIndex = 0;

  // private clockSpeed: number;
  // private recipe: Recipe;

  private tickCycle: number = 0;
  private cycleTime: number = 1;
  // constructor() {
  //
  // }

  private processExports() {}

  private processImports() {}

  simulate(dt: number): void {
    this.tickCycle += dt;

    while (this.tickCycle > this.cycleTime) {
      this.tickCycle -= this.cycleTime;
      // Do one cycle worth of actions
      this.processImports();
      this.processExports();
    }
  }
}
