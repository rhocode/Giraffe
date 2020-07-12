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
  position: SatisGraphtoryCoordinate;
}

export interface SatisGraphtoryEdge {
  edgeId: string;
  type: string;
  sourceId: string;
  targetId: string;
  source: SatisGraphtoryCoordinate;
  target: SatisGraphtoryCoordinate;
}

export interface SatisGraphtoryCoordinate {
  x: number;
  y: number;
}
