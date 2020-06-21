export type SatisGraphtoryNode = {
  nodeId: string;
  recipe: string;
  overclock: number;
  inputs: any[];
  outputs: any[];
  type: string;
};

export type SatisGraphtoryEdge = {
  edgeId: string;
  type: string;
};

export type SatisGraphtoryNodePosition = {
  x: number;
  y: number;
};
