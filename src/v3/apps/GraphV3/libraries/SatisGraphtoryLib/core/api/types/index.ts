import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';

export interface SatisGraphtoryNodeProps {
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

export interface SatisGraphtoryEdgeProps {
  edgeId: string;
  type: string;
  // sourceId: string;
  // targetId: string;
  // source: SatisGraphtoryCoordinate;
  // target: SatisGraphtoryCoordinate;
  // This is a big NoNo, since we're mixing data and graphics :(
  sourceNode: AdvancedNode;
  targetNode: AdvancedNode;
}

export interface SatisGraphtoryCoordinate {
  x: number;
  y: number;
}
