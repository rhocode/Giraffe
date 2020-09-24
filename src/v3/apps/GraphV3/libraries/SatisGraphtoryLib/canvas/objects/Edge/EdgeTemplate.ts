import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { EResourceForm } from '.data-landing/interfaces/enums';

export enum EdgeType {
  OUTPUT,
  INPUT,
  ANY,
}

export enum EdgeAttachmentSide {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
}

export class EdgeContainer extends GraphObjectContainer {
  getBounds(): any {
    return super.getInheritedBounds();
  }
}

export default abstract class EdgeTemplate extends GraphObject {
  id: string;
  targetNode: NodeTemplate | null;
  sourceNode: NodeTemplate | null;
  resourceForm: EResourceForm = EResourceForm.RF_SOLID;
  container: EdgeContainer;
  // The left node usually
  sourceNodeAttachmentSide: EdgeAttachmentSide = EdgeAttachmentSide.RIGHT;
  // The right node usually
  targetNodeAttachmentSide: EdgeAttachmentSide = EdgeAttachmentSide.LEFT;

  biDirectional: Boolean;

  abstract enableHitBox(): void;
  abstract disableHitBox(): void;
  abstract update(): void;

  constructor(props: SatisGraphtoryEdgeProps) {
    super();
    const {
      sourceNode,
      targetNode,
      id,
      resourceForm,
      sourceNodeAttachmentSide,
      targetNodeAttachmentSide,
      biDirectional = false,
    } = props;

    this.container = new EdgeContainer();
    this.id = id;
    this.container.id = id;
    this.sourceNode = sourceNode ? sourceNode : null;
    this.targetNode = targetNode ? targetNode : null;

    this.biDirectional = biDirectional;

    if (resourceForm != null) {
      this.resourceForm = resourceForm;
    }

    if (sourceNodeAttachmentSide !== undefined) {
      this.sourceNodeAttachmentSide = sourceNodeAttachmentSide;
    }

    if (targetNodeAttachmentSide !== undefined) {
      this.targetNodeAttachmentSide = targetNodeAttachmentSide;
    }
  }

  replaceEdge(replacementEdge: EdgeTemplate, edgeType: EdgeType) {
    if (edgeType === EdgeType.INPUT) {
      replacementEdge.targetNodeAttachmentSide = this.targetNodeAttachmentSide;
    } else if (edgeType === EdgeType.OUTPUT) {
      replacementEdge.sourceNodeAttachmentSide = this.sourceNodeAttachmentSide;
    }

    this.delete();
    return replacementEdge;
  }

  delete(): GraphObject[] {
    if (this.container) {
      this.sourceNode?.deleteEdge(this);
      this.targetNode?.deleteEdge(this);
      this.container.destroy();
    }
    this.container = (null as unknown) as any;
    return [this];
  }
}
