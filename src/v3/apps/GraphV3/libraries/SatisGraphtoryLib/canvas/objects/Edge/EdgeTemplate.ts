import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { SatisGraphtoryEdgeProps } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { EResourceForm } from '.data-landing/interfaces/enums';

export enum EdgeType {
  INVALID,
  OUTPUT,
  INPUT,
  ANY,
}

export enum EdgeAttachmentSide {
  INVALID,
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

  connectorName: string | null;

  abstract enableHitBox(): void;
  abstract disableHitBox(): void;
  abstract update(): void;
  abstract updateWithoutHitBox(): void;

  constructor(props: SatisGraphtoryEdgeProps) {
    super(props);
    const {
      sourceNode,
      targetNode,
      id,
      resourceForm,
      sourceNodeAttachmentSide,
      targetNodeAttachmentSide,
      connectorName,
      biDirectional = false,
    } = props;

    this.container = new EdgeContainer();
    this.id = id;
    this.container.id = id;
    this.sourceNode = sourceNode ? sourceNode : null;
    this.targetNode = targetNode ? targetNode : null;

    this.biDirectional = biDirectional;

    this.connectorName = connectorName || null;

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

  replaceEdge(
    replacementEdge: EdgeTemplate,
    edgeType: EdgeType,
    useProvidedAttachmentSides: boolean = true
  ) {
    if (!useProvidedAttachmentSides) {
      if (edgeType === EdgeType.INPUT) {
        replacementEdge.targetNodeAttachmentSide = this.targetNodeAttachmentSide;
      } else if (edgeType === EdgeType.OUTPUT) {
        replacementEdge.sourceNodeAttachmentSide = this.sourceNodeAttachmentSide;
      }
    }

    this.delete();
    return replacementEdge;
  }

  getAttachmentSide(node: NodeTemplate) {
    if (!this.sourceNode && !this.targetNode) {
      return Infinity;
    }

    if (!this.sourceNode || !this.targetNode) {
      throw new Error('Only one of the nodes are null for ' + this.id);
    }

    if (this.sourceNode === node && this.targetNode === node) {
      throw new Error(
        'Cannot infer attachment side due to both source and target being this node ' +
          this.id
      );
    }

    if (this.sourceNode === node && this.targetNode) {
      return this.sourceNodeAttachmentSide;
    }

    if (this.targetNode === node && this.sourceNode) {
      return this.targetNodeAttachmentSide;
    }

    throw new Error('Could not infer attachment side ' + this.id);
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
