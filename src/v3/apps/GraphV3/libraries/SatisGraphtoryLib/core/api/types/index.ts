import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { EResourceForm } from '.data-landing/interfaces/enums';
import EdgeTemplate, {
  EdgeAttachmentSide,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

export interface SatisGraphtoryNodeProps {
  id: string;
  recipeName: string;
  recipeLabel: string;
  overclock: number;
  inputConnections?: EdgeTemplate[];
  outputConnections?: EdgeTemplate[];
  anyConnections?: EdgeTemplate[];
  machineName: string;
  machineLabel: string;
  tier: number;
  position: SatisGraphtoryCoordinate;
}

export interface SatisGraphtoryEdgeProps {
  id: string;
  resourceForm?: EResourceForm;
  sourceNode?: NodeTemplate;
  targetNode?: NodeTemplate;
  sourceNodeAttachmentSide?: EdgeAttachmentSide;
  targetNodeAttachmentSide?: EdgeAttachmentSide;
  biDirectional?: Boolean;
}

export interface SatisGraphtoryCoordinate {
  x: number;
  y: number;
}
