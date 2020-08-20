import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class DebugExtractor extends SimulatableConnection {
  constructor(itemSlug: string, amount: number, time: number) {
    super();

    for (let i = 0; i < amount; i++) {
      this.outputPacket.push({
        slug: itemSlug,
        amount: 1,
      });
    }

    this.cycleTime = time;
    this.outputSlot.push([]);
  }

  blocked = false;

  unblockCallback = (null as unknown) as any;

  handleEvent(evt: any, time: number, eventData: any) {
    switch (evt) {
      case 'DEPOSIT_OUTPUT':
        if (!this.blocked) {
          this.depositFunction(time);
        } else {
          this.unblockCallback = (time: number) => {
            this.depositFunction(time);
          };
        }
        break;
      case 'UNBLOCK':
        if (this.outputSlot[0].length === 0) {
          this.blocked = false;
          if (this.unblockCallback) {
            this.unblockCallback(time);
            this.unblockCallback = null;
          }
        }
        break;
      default:
        throw new Error('Unhandled event ' + evt);
    }
  }

  private depositFunction(time: number) {
    this.outputSlot[0].push(...this.outputPacket);

    this.outputs.forEach((output) => {
      this.simulationManager?.addTimerEvent({
        // TODO: should this not have a +1?
        time: time,
        event: {
          target: output.id,
          eventName: 'PULL',
          eventData: this.id,
        },
      });
    });
    this.simulationManager?.addTimerEvent({
      time: time + this.cycleTime,
      event: {
        target: this.id,
        eventName: 'DEPOSIT_OUTPUT',
        eventData: this.outputPacket,
      },
    });
    this.blocked = true;
  }

  runPreSimulationActions(): void {
    if (true) {
      // TODO: if this is powered
      this.simulationManager?.addTimerEvent({
        time: this.cycleTime,
        event: {
          target: this.id,
          eventName: 'DEPOSIT_OUTPUT',
          eventData: this.outputPacket,
        },
      });
    }
  }
}
