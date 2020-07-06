export interface SatisGraphtoryNode {
  nodeId: string;
  recipe: string;
  overclock: number;
  inputs: any[];
  outputs: any[];
  type: string;
}

export interface SatisGraphtoryDisplayNode extends SatisGraphtoryNode {
  blah: string;
}

export interface SatisGraphtoryEdge {
  edgeId: string;
  type: string;
}

export interface SatisGraphtoryNodePosition {
  x: number;
  y: number;
}
