import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

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
  sourceNode: NodeTemplate;
  targetNode: NodeTemplate;
}

export interface SatisGraphtoryCoordinate {
  x: number;
  y: number;
}
