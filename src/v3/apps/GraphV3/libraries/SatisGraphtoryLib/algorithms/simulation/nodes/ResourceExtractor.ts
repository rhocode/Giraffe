import {getBuildingDefinition} from "v3/data/loaders/buildings";
import {getRecipeDefinition} from "v3/data/loaders/recipes";
import SimulatableConnection
  from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection";

export default class ResourceExtractor implements SimulatableConnection {

  readonly inputReservoir = false
  private readonly outputPacket = [] as any[];

  constructor(recipeSlug: any, buildingSlug: any, clockSpeed = 100) {
    const recipe = getRecipeDefinition(recipeSlug);

    const building = getBuildingDefinition(buildingSlug);

    const cycleTime = building.extractCycleTime * 1000 * recipe.manufacturingDuration;
    const itemsPerCycle = building.itemsPerCycle;

    this.outputPacket = recipe.products.map((item: any) => {
      return {
        slug: item.slug,
        amount: item.amount * itemsPerCycle
      }
    });

    this.cycleTime = cycleTime / (clockSpeed / 100);
  }


  outputObject: any;

  addOutput(output: any) {
    this.outputObject = output;
  }



  private tickCycle: number = 0;
  private readonly cycleTime: number;

  outputSlot = [] as any[];
  queuedOutputSlot = [] as any[];

  hasOutput() {
    return this.outputSlot.length > 0
  }

  getOutputItemTime() {
    const item = this.outputSlot[0];
    return item.timeStamp;
  }

  getOutputItem(timestamp: number) {
    if (!this.outputSlot.length) {
      throw new Error("Tried to get output item where none exists");
    }

    const item = this.outputSlot[0];
    item.amount -= 1;
    console.log("[   RESX   ] Removing item, now", item.amount)
    if (!item.amount) {
      console.log("[   RESX   ] Removing entire item from output")
      this.outputSlot.shift();
    }

    if (!this.outputSlot.length) {
      console.log("[   RESX   ] Slot is now empty")
      if (this.queuedOutputSlot.length) {
        this.outputSlot = this.queuedOutputSlot;
        this.queuedOutputSlot = [];
      }
      if (this.currentState === this.state.BLOCKED) {
        this.currentState = this.state.PROCESSING;
        console.log(this.blockedTimeStart, timestamp)
        throw new Error("We need to validate this");
      }
    }

    return {
      name: item.slug,
      timeStamp: item.timeStamp
    };
  }

  blockedTime = 0;
  blocked = false;


  state = {
    START: 'start',
    PROCESSING: 'processing',
    BLOCKED: 'blocked'
  }

  currentState = this.state.START;
  blockedTimeStart = 0;

  simulate(dtMs: number, absoluteTime: number): void {
    // state START
    if (this.currentState === this.state.START) {
      // set up the processing.
       if (true) { // if there is an input
         this.currentState = this.state.PROCESSING
       }
    }

    if (this.currentState === this.state.PROCESSING) {
      this.tickCycle += dtMs;

      if (this.tickCycle >= this.cycleTime) {
        // Preempt putting an output if we will be processing it next cycle.

        let queueToPush;
        const taskFinishedTime = absoluteTime + dtMs - (this.tickCycle - this.cycleTime);

        if (this.hasOutput()) {
          queueToPush = this.queuedOutputSlot;
          this.currentState = this.state.BLOCKED
          this.blockedTimeStart = taskFinishedTime;
          console.log("[   RESX   ] Blocked at", taskFinishedTime)
        } else {
          queueToPush = this.outputSlot;
          this.currentState = this.state.START
          console.log("[   RESX   ] Processing with blocked at", taskFinishedTime)
        }

        for (let item of this.outputPacket) {
          queueToPush.push({
            slug: item.slug,
            amount: item.amount,
            timeStamp: taskFinishedTime
          })
        }

        this.tickCycle -= this.cycleTime;
      }
    }

  }
}
