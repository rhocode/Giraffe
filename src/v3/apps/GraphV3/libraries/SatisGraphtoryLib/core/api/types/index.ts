export interface SatisGraphtoryNode {
  nodeId: string;
  recipeName: string;
  recipeLabel: string;
  overclock: number;
  inputs: any[];
  outputs: any[];
  machineName: string;
  machineLabel: string;
  tier: number;
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
