import Simulatable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable';
import {getRecipeDefinition} from "v3/data/loaders/recipes";
import {getBuildingDefinition} from "v3/data/loaders/buildings";
import SimulatableConnection
  from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection";
// import Slot from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/shared/Slot";
// import Recipe from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/objects/Recipe";

type sgUnblockCallback = {
  func: Function,
  time: number
}

export default class Manufacturer implements SimulatableConnection {
  readonly inputReservoir = true

  private tickCycle: number = 0;
  private cycleTime: number = 1;

  inputRequirements = [] as any;

  private recipeIngredientMap = new Map<string, number>();
  private recipeRemainingMap = new Map<string, number>();

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
    recipe.ingredients.forEach(({slug, amount}: {slug: string, amount: number}) => {
      this.recipeIngredientMap.set(slug, amount);
      this.recipeRemainingMap.set(slug, amount);
      this.unblockCallbacks.set(slug, []);
    })
  }

  getOutputItemTime(): number {
        throw new Error("Method not implemented.");
    }
  getOutputItem(timestamp: number) {
      throw new Error("Method not implemented.");
  }

  inputObject: any;

  addInput(input: any) {
    this.inputObject = input;
  }

  state = {
    IDLE: 'idle',
    START: 'start',
    GATHER: 'gather',
    PROCESSING: 'processing',
    BLOCKED: 'blocked'
  }

  currentState = this.state.IDLE;
  blockedTimeStart = 0;

  outputSlot = [] as any[];
  queuedOutputSlot = [] as any[];

  outputPacket = [] as any;

  hasOutput() {
    return this.outputSlot.length > 0
  }

  lastProcessedTime = 0;

  itemsArrivedTime = 0;

  recipeGatheredTime = 0;

  canAddItem(slug: string, tick: number) {
    const remaining = this.recipeRemainingMap.get(slug);
    if (remaining === undefined) {
      throw new Error("Cannot add item " + slug)
    }
    this.recipeRemainingMap.get(slug)

    if (remaining > 0) {
      this.recipeRemainingMap.set(slug, remaining - 1);
      this.recipeGatheredTime = Math.max(this.recipeGatheredTime, tick);
    }

    return remaining > 0;
  }


  unblockCallbacks: Map<string, sgUnblockCallback[]> = new Map<string, sgUnblockCallback[]>();

  addUnblockCallback(callback: Function, time: number, type: string) {
    const unlockCallbackFunctions = this.unblockCallbacks.get(type);
    if (!unlockCallbackFunctions) {
      throw new Error("Not able to add type " + type);
    }
    unlockCallbackFunctions.push({
      func: callback,
      time
    });
  }

  inputSlotProcessed = false
  isInputSlotFull() {
    return this.inputSlotProcessed;
  }
  inputSlot = [] as any[];

  processInput() {

  }

  simulate(dtMs: number, absoluteTime: number): void {
    if (this.currentState === this.state.IDLE) {
      //TODO: optimize?
      if ([...this.recipeRemainingMap.values()].every((a: number) => a === 0)) {
        this.currentState = this.state.START;

        for (const [key, value] of this.recipeIngredientMap.entries()) {
          this.recipeRemainingMap.set(key, value);
        }

      }
    }

    // state START
    if (this.currentState === this.state.START) {
      // set up the processing.
      if (absoluteTime + dtMs > this.recipeGatheredTime) {
        this.currentState = this.state.PROCESSING
        const startedTime = absoluteTime - this.recipeGatheredTime;
        this.tickCycle = absoluteTime - this.recipeGatheredTime;
        if (absoluteTime - this.recipeGatheredTime < 0) {
          throw new Error("Find out why this is negative?");
        }
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
          console.log("[   MANU   ] Reached blocked", taskFinishedTime);
        } else {
          queueToPush = this.outputSlot;
          this.currentState = this.state.IDLE
          console.log("[   MANU   ] Reached processing with blocked", taskFinishedTime);
        }

        this.lastProcessedTime = taskFinishedTime;

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
