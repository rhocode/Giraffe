import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class Merger extends SimulatableConnection {
  constructor() {
    super();
    this.cycleTime = 0;
    this.outputSlot.push([]);
  }

  inputBlocked = false;
  inputBlockedCallbacks = ([] as unknown) as any[];

  processing = false;
  depositCallbacks = ([] as unknown) as any[];

  outputBlocked = false;
  outputBlockedCallbacks = ([] as unknown) as any[];

  handleEvent(evt: any, time: number, eventData: any) {
    console.log('Handling Merger event');
    switch (evt) {
      case 'UNBLOCK':
        if (this.outputSlot[0].length === 0 && this.outputBlocked) {
          this.outputBlocked = false;
          for (const func of this.outputBlockedCallbacks) {
            func(time);
          }
          this.outputBlockedCallbacks = [];
        }
        break;
      case 'DEPOSIT_OUTPUT':
        const depositFunction = (time: number, eventData: any) => {
          this.outputSlot[0].push(eventData);
          this.outputBlocked = true;
          this.processing = false;

          for (const func of this.depositCallbacks) {
            func(time);
          }
          this.depositCallbacks = [];

          console.error('CALLING PULL', this.outputSlot[0]);

          this.outputs.forEach((output) => {
            this.simulationManager?.addTimerEvent({
              time: time,
              event: {
                target: output.id,
                eventName: 'PULL',
              },
            });
          });
        };
        if (this.outputBlocked) {
          this.outputBlockedCallbacks.push((time: number) => {
            depositFunction(time, eventData);
          });
        } else {
          depositFunction(time, eventData);
        }
        break;
      case 'START_CYCLE':
        const inputBlockedCallbacksCopy = [...this.inputBlockedCallbacks];
        this.inputBlockedCallbacks = [];
        this.processing = true;
        this.inputBlocked = false;

        this.simulationManager?.addTimerEvent({
          time: time + this.cycleTime,
          event: {
            target: this.id,
            eventName: 'DEPOSIT_OUTPUT',
            eventData: eventData,
          },
        });

        // This is done so that if any of these callback functions are blocked we can still
        // let them mutate inputBlockedCallbacks.
        for (const func of inputBlockedCallbacksCopy) {
          func(time);
        }
        break;
      case 'PULL':
        const pullFunction = (time: number, eventData: any) => {
          const referencedInput = this.inputs.find(
            (item) => item.id === eventData
          );
          if (!referencedInput)
            throw new Error('Referenced input does not exist');

          const referencedOutputSlot = referencedInput.getOutputSlot(this.id);

          if (referencedOutputSlot.length === 0) {
            throw new Error('Called pull with no output items');
          }

          const outputPacket = referencedOutputSlot[0]!;

          referencedOutputSlot.shift();

          this.simulationManager?.addTimerEvent({
            time: time,
            event: {
              target: referencedInput.id,
              eventName: 'UNBLOCK',
            },
          });

          this.inputBlocked = true;

          const startCycleFunction = (time: number) => {
            this.simulationManager?.addTimerEvent({
              time: time,
              event: {
                target: this.id,
                eventName: 'START_CYCLE',
                eventData: outputPacket,
              },
            });
          };
          if (this.processing) {
            this.depositCallbacks.push((time: number) => {
              startCycleFunction(time);
            });
          } else {
            startCycleFunction(time);
          }
        };
        if (!this.inputBlocked) {
          pullFunction(time, eventData);
        } else {
          this.inputBlockedCallbacks.push((time: number) => {
            pullFunction(time, eventData);
          });
        }
        break;
      default:
        throw new Error('Unhandled event ' + evt + ' at ' + time);
    }
  }
}
