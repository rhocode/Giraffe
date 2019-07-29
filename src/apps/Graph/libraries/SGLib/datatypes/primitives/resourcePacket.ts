class ResourcePacket {
  itemId: number;
  itemQty: number;

  protected constructor(itemId: number, itemQty: number) {
    this.itemId = itemId;
    this.itemQty = itemQty;
  }
}

export default ResourcePacket;
