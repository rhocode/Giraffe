import Simulatable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable';
import SimulatableConnection
  from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection";

export default class Belt implements SimulatableConnection {

  readonly inputReservoir = false

  constructor(beltSpeed: number) {
    this.cycleTime = (60 * 1000) / beltSpeed;
  }

  inputObject: any;





  addInput(input: any) {
    this.inputObject = input;
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


  private tickCycle: number = 0;
  private readonly cycleTime: number;

  state = {
    START: 'start',
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

  inputIsFull() {
    return false;
  }

  inputItems = [] as any;

  addInputItem(anything: any) {

  }


  simulate(dtMs: number, absoluteTime: number): void {
    // state START
    if (this.currentState === this.state.START) {
      // set up the processing.
      if (this.inputObject.hasOutput()) { // if there is an input
        if (this.inputObject.getOutputItemTime() <= absoluteTime) {
          // TODO: take the max of ???
          const startingTime = Math.max(this.inputObject.getOutputItemTime(), this.lastProcessedTime); // ????
          this.currentState = this.state.PROCESSING
          this.tickCycle = (absoluteTime) - startingTime;
          console.log("[   BELT   ] Starting tick cycle at", this.tickCycle, " Will add to make it", this.tickCycle + dtMs);
          const fetchedItem = this.inputObject.getOutputItem(startingTime);
          this.outputPacket = [
            {
              slug: fetchedItem.slug,
              amount: 1,
              timeStamp: fetchedItem.timestamp
            }
          ]
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
          console.log("[   BELT   ] Reached blocked", taskFinishedTime);
        } else {
          queueToPush = this.outputSlot;
          this.currentState = this.state.START
          console.log("[   BELT   ] Reached processing with blocked", taskFinishedTime);
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

  //
  // outputWaitingItem = null as any;
  // outputSlotWaiting = false;
  //
  // queuedItem = null as any;
  // queuedSlotWaiting = false;
  //
  // processing = false;
  // itemWaitingSince = 0;
  //
  // simulate(dtMs: number, absoluteTime: number): void {
  //
  //     //check output
  //     if (this.outputSlotWaiting) { // TODO: if can be outputted
  //       if (false) {
  //         // No action.
  //       } else {
  //         // We can output!!
  //         console.log("We should be outputting the slot here at slotTime", this.itemWaitingSince)
  //
  //         //we should take the avaliable time of the other output and take the max of it to figure out when
  //
  //         this.outputWaitingItem = null;
  //         this.itemWaitingSince = 0;
  //         this.outputSlotWaiting = false;
  //       }
  //     } // state RESET_OUTPUT
  //
  //
  //   const timeLimit = absoluteTime + dtMs;
  //
  //   if (!this.outputSlotWaiting && !this.processing && this.inputObject?.hasOutput()
  //     && this.inputObject.getOutputItemTime() < timeLimit) {
  //
  //     const { name, timeStamp }  = this.inputObject.getOutputItem();
  //     this.outputWaitingItem = name;
  //
  //     console.log("Belt received item", timeStamp, ", it is", absoluteTime);
  //     this.tickCycle = absoluteTime - timeStamp;
  //     this.processing = true;
  //   } // state START_PROCESSING
  //
  //     if (this.processing) {
  //       this.tickCycle += dtMs;
  //     } // State PROCESS_LOOP
  //
  //     if (this.processing && this.tickCycle >= this.cycleTime) {
  //       this.itemWaitingSince = absoluteTime + dtMs - (this.tickCycle - this.cycleTime);
  //       console.error("Set finish processing at time", this.itemWaitingSince, "absolute is",absoluteTime)
  //       this.processing = false;
  //       this.outputSlotWaiting = true;
  //     } // State READY_TO_OUTPUT
  //
  // }
}
