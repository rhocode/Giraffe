import Simulatable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable';
import SimulationManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/manager/SimulationManager';
import stringGen from 'v3/utils/stringGen';

export type OutputPacket = {
  slug: string;
  amount: number;
};

export default abstract class SimulatableConnection implements Simulatable {
  inputs: SimulatableConnection[] = [];
  outputs: SimulatableConnection[] = [];
  cycleTime: number = 0;

  id: string = stringGen(10);

  outputSlot = [] as OutputPacket[][];
  protected outputPacket = [] as OutputPacket[];

  simulationManager: SimulationManager | null = null;

  attachSimulationManager(simulationManager: SimulationManager) {
    this.simulationManager = simulationManager;
    simulationManager.register(this);
  }

  runPreSimulationActions(): void {
    // noop.
  }

  getOutputSlot(id: string) {
    return this.outputSlot[0];
  }

  abstract handleEvent(evt: any, time: number, eventData: any): any;
}
