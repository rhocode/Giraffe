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
    } = props;

    this.container = new EdgeContainer();
    this.id = id;
    this.container.id = id;
    this.sourceNode = sourceNode ? sourceNode : null;
    this.targetNode = targetNode ? targetNode : null;

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
}
