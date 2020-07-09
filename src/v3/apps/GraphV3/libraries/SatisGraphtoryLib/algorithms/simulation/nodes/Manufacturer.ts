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

  // constructor() {
  //
  // }

  private processExports() {}

  private processImports() {}

  simulate(elapsedTime: number): void {
    this.processImports();
    this.processExports();
  }
}
