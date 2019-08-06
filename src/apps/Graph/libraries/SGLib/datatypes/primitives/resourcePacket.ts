class ResourcePacket {
  itemId: number;
  itemQty: number;

  constructor(itemId: number, itemQty: number) {
    this.itemId = itemId;
    this.itemQty = itemQty;
  }
}

export default ResourcePacket;
