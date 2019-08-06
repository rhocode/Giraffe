import ResourcePacket from './resourcePacket';

class Recipe {
  input: Array<ResourcePacket>;
  output: Array<ResourcePacket>;
  time: number;

  constructor(
    input: Array<ResourcePacket>,
    output: Array<ResourcePacket>,
    time: number
  ) {
    this.input = input;
    this.output = output;
    this.time = time;
  }
}

export default Recipe;
