import Simulatable from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/Simulatable";

export default interface SimulatableConnection extends Simulatable{
  hasOutput(): boolean
  getOutputItemTime(): number
  getOutputItem(timestamp: number): any
  readonly inputReservoir: boolean;
}
