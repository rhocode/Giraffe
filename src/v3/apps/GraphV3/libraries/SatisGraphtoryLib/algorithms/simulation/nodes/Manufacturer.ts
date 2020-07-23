import Simulatable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable';
import {getRecipeDefinition} from "v3/data/loaders/recipes";
import {getBuildingDefinition} from "v3/data/loaders/buildings";
import SimulatableConnection
  from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection";
// import Slot from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/shared/Slot";
// import Recipe from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/objects/Recipe";

export default class Manufacturer implements SimulatableConnection {
  readonly inputReservoir = true

  private tickCycle: number = 0;
  private cycleTime: number = 1;

  inputRequirements = [] as any;

  constructor(recipeSlug: any, buildingSlug: any, clockSpeed = 100) {
    const recipe = getRecipeDefinition(recipeSlug);

    const building = getBuildingDefinition(buildingSlug);

    const cycleTime = 1000 * recipe.manufacturingDuration * building.manufacturingSpeed;

    this.outputPacket = recipe.products.map((item: any) => {
      return {
        slug: item.slug,
        amount: item.amount
      }
    });

    this.cycleTime = cycleTime / (clockSpeed / 100);
  }

  getOutputItemTime(): number {
        throw new Error("Method not implemented.");
    }
    getOutputItem(timestamp: number) {
        throw new Error("Method not implemented.");
    }

  inputSlot = [] as any[];

  inputObject: any;

  addInput(input: any) {
    this.inputObject = input;
  }

  state = {
    START: 'start',
    GATHER: 'gather',
    PROCESSING: 'processing',
    BLOCKED: 'blocked'
  }

  currentState = this.state.START;
  blockedTimeStart = 0;

  outputSlot = [] as any[];
  queuedOutputSlot = [] as any[];

  outputPacket = [] as any;

  hasOutput() {
    return this.outputSlot.length > 0
  }

  lastProcessedTime = 0;

  simulate(dtMs: number, absoluteTime: number): void {
  //   // state START
  //   if (this.currentState === this.state.START) {
  //     // set up the processing.
  //     if (this.inputObject.hasOutput()) { // if there is an input
  //       if (this.inputObject.getOutputItemTime() <= absoluteTime) {
  //         // TODO: take the max of ???
  //         const startingTime = Math.max(this.inputObject.getOutputItemTime(), this.lastProcessedTime); // ????
  //         this.currentState = this.state.PROCESSING
  //         this.tickCycle = (absoluteTime) - startingTime;
  //         console.log("[   MANU   ] Starting tick cycle at", this.tickCycle, " Will add to make it", this.tickCycle + dtMs, "starting time", startingTime);
  //         const fetchedItem = this.inputObject.getOutputItem(startingTime);
  //         this.outputPacket = [
  //           {
  //             slug: fetchedItem.slug,
  //             amount: 1,
  //             timeStamp: fetchedItem.timestamp
  //           }
  //         ]
  //       }
  //     }
  //   }
  //
  //   if (this.currentState === this.state.PROCESSING) {
  //     this.tickCycle += dtMs;
  //
  //     if (this.tickCycle >= this.cycleTime) {
  //
  //       // Preempt putting an output if we will be processing it next cycle.
  //
  //       let queueToPush;
  //       const taskFinishedTime = absoluteTime + dtMs - (this.tickCycle - this.cycleTime);
  //       if (this.hasOutput()) {
  //         queueToPush = this.queuedOutputSlot;
  //         this.currentState = this.state.BLOCKED
  //         this.blockedTimeStart = taskFinishedTime;
  //         console.log("[   MANU   ] Reached blocked", taskFinishedTime);
  //       } else {
  //         queueToPush = this.outputSlot;
  //         this.currentState = this.state.START
  //         console.log("[   MANU   ] Reached processing with blocked", taskFinishedTime);
  //       }
  //
  //       this.lastProcessedTime = taskFinishedTime;
  //
  //       for (let item of this.outputPacket) {
  //         queueToPush.push({
  //           slug: item.slug,
  //           amount: item.amount,
  //           timeStamp: taskFinishedTime
  //         })
  //       }
  //
  //       this.tickCycle -= this.cycleTime;
  //     }
  //   }
  }
}
