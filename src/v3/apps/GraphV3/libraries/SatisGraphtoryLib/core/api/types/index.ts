import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { EResourceForm } from '.data-landing/interfaces/enums';
import EdgeTemplate, {
  EdgeAttachmentSide,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { GraphObjectProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';

export interface SatisGraphtoryNodeProps extends GraphObjectProps {
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

export interface SatisGraphtoryEdgeProps extends GraphObjectProps {
  id: string;
  resourceForm?: EResourceForm;
  sourceNode?: NodeTemplate;
  targetNode?: NodeTemplate;
  sourceNodeAttachmentSide?: EdgeAttachmentSide;
  targetNodeAttachmentSide?: EdgeAttachmentSide;
  connectorName?: string;
  connectorLabel?: string;
  biDirectional?: Boolean;
  ignoreLinking?: Boolean;
}

export interface SatisGraphtoryCoordinate {
  x: number;
  y: number;
}
