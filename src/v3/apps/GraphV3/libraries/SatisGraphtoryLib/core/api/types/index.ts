export interface SatisGraphtoryNode {
  nodeId: string;
  recipe: string;
  overclock: number;
  inputs: any[];
  outputs: any[];
  type: string;
  position: SatisGraphtoryNodePosition;
}

export interface SatisGraphtoryEdge {
  edgeId: string;
  type: string;
  sourceId: string;
  targetId: string;
}

export interface SatisGraphtoryNodePosition {
  x: number;
  y: number;
}
