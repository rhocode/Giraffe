import PriorityQueue from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/datastructures/priorityqueue/PriorityQueue';
import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

type SimulationEvent = {};

type ScheduledTask = {
  time: number;
  event: SimulationEvent | any;
};

export default class SimulationManager {
  // The tickspeed is set based on 60/ MAX_BELT_SPEED
  private readonly tickSpeed = 50;

  private simulationTimeline: PriorityQueue<ScheduledTask>;
  private objectMap = new Map<string, SimulatableConnection>();

  constructor() {
    this.simulationTimeline = new PriorityQueue<any>({
      comparator: (a, b) => a.time - b.time,
    });
  }

  register(obj: SimulatableConnection) {
    this.objectMap.set(obj.id, obj);
  }

  prepare() {
    Array.from(this.objectMap.values()).forEach((connection) => {
      connection.runPreSimulationActions();
    });
  }

  private currentTick = 0;

  tick() {
    while (true) {
      if (!this.simulationTimeline.length) break;
      if (this.simulationTimeline.peek().time >= this.currentTick) {
        break;
      }
      const current = this.simulationTimeline.dequeue();
      const { target, eventName, eventData } = current.event;
      console.log('Processing ', current, 'at', this.currentTick);
      this.objectMap
        .get(target)
        ?.handleEvent(eventName, current.time, eventData);
    }

    this.currentTick += this.tickSpeed;
  }

  addTimerEvent(evt: ScheduledTask) {
    this.simulationTimeline.queue(evt);
  }

  addLink(source: SimulatableConnection, target: SimulatableConnection) {
    source.outputs.push(target);
    target.inputs.push(source);
  }
}
