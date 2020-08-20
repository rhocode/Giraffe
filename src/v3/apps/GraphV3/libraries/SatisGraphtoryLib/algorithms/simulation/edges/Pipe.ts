import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class Pipe extends SimulatableConnection {
  static readonly maxFlowPerMs = 300 / 6; // 50 liters/ms
  static readonly maxPipeContent = 1000;

  constructor() {
    super();
    this.outputSlot.push([]);
  }

  blocked = false;
  unblockCallback = (null as unknown) as any;

  handleEvent(evt: any, time: number, eventData: any) {
    console.log('Handling pipe event ');
    switch (evt) {
      case 'FLUSH':
        const left = this.inputs.length ? this.inputs[0] : null;
        const right = this.outputs.length ? this.outputs[0] : null;
        const source = eventData === left?.id ? left : right;
        const target = source === left ? right : left;

        console.log(source, target);

        break;
      default:
        throw new Error('Unhandled event ' + evt);
    }
  }
}
