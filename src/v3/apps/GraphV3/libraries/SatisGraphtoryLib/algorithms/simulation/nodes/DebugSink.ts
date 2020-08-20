import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class DebugSink extends SimulatableConnection {
  blocked = false;
  unblockCallback = (null as unknown) as any;
  inputBlocked = false;

  handleEvent(evt: any, time: number, eventData: any) {
    console.log('Handling DebugSink event');
    switch (evt) {
      case 'PULL':
        const itemsRetrieved = this.inputs
          .map((input) => {
            const slot = input.getOutputSlot('');
            if (slot.length) {
              return slot.shift();
            }

            return null;
          })
          .filter((item) => item);

        console.error(
          'Debug sink ' + this.id + ' received ',
          itemsRetrieved,
          'at',
          time
        );

        if (itemsRetrieved.length === 0) {
          throw new Error('Push was called but no item to get!');
        }

        this.inputs.forEach((input) => {
          this.simulationManager?.addTimerEvent({
            time: time,
            event: {
              target: input.id,
              eventName: 'UNBLOCK',
            },
          });
        });
        break;
      default:
        throw new Error('Unhandled event ' + evt);
    }
  }
}
