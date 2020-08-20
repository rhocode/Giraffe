import SimulatableConnection, {
  OutputPacket,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class Manufacturer extends SimulatableConnection {
  inputIndex = 0;

  maxQueuedStackSize = 10;
  queue: OutputPacket[] = [];

  inputBlocked = false;
  inputBlockedCallbacks = ([] as unknown) as any[];

  outputIdMap = new Map<string, number>();
  blockedMap = new Map<number, boolean>();

  getOutputSlot(id: string) {
    const slotId = this.outputIdMap.get(id);
    if (slotId === undefined) {
      throw new Error('ID not connected to splitter ' + id);
    }

    return this.outputSlot[slotId];
  }

  runPreSimulationActions() {
    super.runPreSimulationActions();
    for (let i = 0; i < this.outputs.length; i++) {
      this.outputIdMap.set(this.outputs[i]!.id, i);
      this.blockedMap.set(i, false);

      // TODO: replace this with the correct number of slots
      this.outputSlot.push([]);
    }
  }

  handleEvent(evt: any, time: number, eventData: any) {
    console.log('Handling Splitter event', evt, eventData);
    switch (evt) {
      case 'UNBLOCK':
        if (this.outputIdMap.get(eventData)! === undefined) {
          throw new Error('Blocked event data is undefined');
        }
        this.blockedMap.set(this.outputIdMap.get(eventData)!, false);

        this.simulationManager?.addTimerEvent({
          time: time,
          event: {
            target: this.id,
            eventName: 'DEPOSIT_CHECK',
          },
        });
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

          const poppedItem = referencedOutputSlot.shift()!;

          this.simulationManager?.addTimerEvent({
            time: time,
            event: {
              target: referencedInput.id,
              eventName: 'UNBLOCK',
            },
          });

          this.queue.push(poppedItem);

          if (this.queue.length === this.maxQueuedStackSize) {
            this.inputBlocked = true;
          }

          this.simulationManager?.addTimerEvent({
            time: time,
            event: {
              target: this.id,
              eventName: 'DEPOSIT_CHECK',
            },
          });
        };
        if (!this.inputBlocked) {
          pullFunction(time, eventData);
        } else {
          this.inputBlockedCallbacks.push((time: number) => {
            pullFunction(time, eventData);
          });
        }
        break;
      case 'DEPOSIT_OUTPUT':
        if (this.queue.length === 0) {
          throw new Error('This queue has zero');
        }

        const index = eventData as number;
        this.outputSlot[index].push(this.queue.shift()!);

        this.simulationManager?.addTimerEvent({
          time: time,
          event: {
            target: this.outputs[index].id,
            eventName: 'PULL',
          },
        });

        this.inputBlocked = false;

        const callbackCopy = [...this.inputBlockedCallbacks];

        this.inputBlockedCallbacks = [];

        for (const func of callbackCopy) {
          func(time);
        }

        break;
      case 'DEPOSIT_CHECK':
        if (this.queue.length === 0) {
          break;
        }

        let indexToCheck = this.inputIndex;

        for (let i = 0; i < this.outputs.length; i++) {
          if (!this.blockedMap.get(indexToCheck)!) {
            // It's not blocked

            this.simulationManager?.addTimerEvent({
              time: time,
              event: {
                target: this.id,
                eventName: 'DEPOSIT_OUTPUT',
                eventData: indexToCheck,
              },
            });

            if (indexToCheck === this.inputIndex) {
              // set the next prioritized index
              this.inputIndex = (indexToCheck + 1) % this.outputSlot.length;
            }
            break;
          }

          indexToCheck = (indexToCheck + 1) % this.outputSlot.length;
        }
        break;
      default:
        throw new Error('Unhandled event ' + evt + ' at ' + time);
    }
  }
}
