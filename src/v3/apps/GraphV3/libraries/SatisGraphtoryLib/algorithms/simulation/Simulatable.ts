export default interface Simulatable {
  simulate: (dt: number, absoluteTIme: number) => void;
}
