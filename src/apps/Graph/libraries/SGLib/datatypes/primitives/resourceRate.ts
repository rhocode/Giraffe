import ResourcePacket from './resourcePacket';

class ResourceRate {
  resource: ResourcePacket;
  time: number;

  constructor(resource: ResourcePacket, time: number) {
    this.resource = resource;
    this.time = time;
  }
}

export default ResourceRate;
