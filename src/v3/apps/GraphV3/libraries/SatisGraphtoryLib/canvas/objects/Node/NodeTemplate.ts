import EdgeTemplate, {
  EdgeAttachmentSide,
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  SatisGraphtoryCoordinate,
  SatisGraphtoryNodeProps,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
// import {sortFunction} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/sortEdges';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Sizes';
import { EmptyEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EmptyEdge';

export class NodeContainer extends GraphObjectContainer {
  public boundCalculator: any = null;

  getBounds = (): any => {
    return this.boundCalculator?.getBounds();
  };
}

export abstract class NodeTemplate extends GraphObject {
  id: string;
  container: NodeContainer;

  inputConnections: EdgeTemplate[] = [];
  outputConnections: EdgeTemplate[] = [];

  connectionsOffsetMap: Map<EdgeAttachmentSide, number[]> = new Map();
  connectionsIndexMap: Map<EdgeTemplate, number> = new Map();
  connectionsSideMap: Map<EdgeTemplate, EdgeAttachmentSide> = new Map();

  protected constructor(props: SatisGraphtoryNodeProps) {
    super();

    const { id, position, inputConnections, outputConnections } = props;

    this.container = new NodeContainer();

    this.container.setTransform(position.x, position.y);

    this.id = id;
    this.container.id = id;

    if (inputConnections) {
      this.inputConnections = inputConnections;
    }

    if (outputConnections) {
      this.outputConnections = outputConnections;
    }
  }

  deleteEdge(edge: EdgeTemplate) {
    for (let i = 0; i < this.inputConnections.length; i++) {
      if (this.inputConnections[i] === edge) {
        this.inputConnections[i] = new EmptyEdge({
          resourceForm: edge.resourceForm,
          id: edge.id,
        });
        break;
      }
    }
    for (let i = 0; i < this.outputConnections.length; i++) {
      if (this.outputConnections[i] === edge) {
        this.outputConnections[i] = new EmptyEdge({
          resourceForm: edge.resourceForm,
          id: edge.id,
        });
        break;
      }
    }
  }

  delete(): GraphObject[] {
    const originalEdges = [...this.inputConnections, ...this.outputConnections];
    for (const edge of this.inputConnections) {
      edge.delete();
    }

    for (const edge of this.outputConnections) {
      edge.delete();
    }

    this.container.destroy();
    return originalEdges;
  }

  private static findFirstEmpty(arr: EdgeTemplate[]) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].sourceNode == null && arr[i].targetNode == null) {
        return i;
      }
    }

    throw new Error('No empty index found');
  }

  addEdge(edge: EdgeTemplate, edgeType: EdgeType) {
    if (edgeType === EdgeType.INPUT) {
      const firstNull = NodeTemplate.findFirstEmpty(this.inputConnections);

      this.inputConnections[firstNull] = edge;
    } else if (edgeType === EdgeType.OUTPUT) {
      const firstNull = NodeTemplate.findFirstEmpty(this.outputConnections);
      this.outputConnections[firstNull] = edge;
    } else {
      console.log('Unimplemented!');
    }

    this.recalculateConnections();
  }

  abstract recalculateConnections(): void;

  sortInputEdges() {
    // this.inputs.sort(
    //   sortFunction(this.container.position.x, this.container.position.y, -1)
    // );
    //
    // this.inputs.forEach((item, index) => {
    //   if (!item) return;
    //   this.edgeMap.set(item.id, index);
    // });
  }

  sortOutputEdges() {
    // this.outputs?.sort(
    //   sortFunction(this.container.position.x, this.container.position.y)
    // );
    //
    // this.outputs.forEach((item, index) => {
    //   if (!item) return;
    //   this.edgeMap.set(item.id, index);
    // });
  }

  updateEdges = () => {
    this.inputConnections.forEach((edge) => {
      if (!edge || !edge?.sourceNode) return;
      edge.sourceNode.sortOutputEdges();
      edge.sourceNode.outputConnections.map((item) => item?.update());
      edge.update();
    });

    this.outputConnections.forEach((edge) => {
      if (!edge || !edge?.targetNode) return;
      edge.targetNode.sortInputEdges();
      edge.targetNode.inputConnections.map((item) => item?.update());
      edge.update();
    });
  };

  getConnectionCoordinate(
    edgeTemplate: EdgeTemplate
  ): SatisGraphtoryCoordinate {
    const side = this.connectionsSideMap.get(edgeTemplate)!;
    const index = this.connectionsIndexMap.get(edgeTemplate)!;
    const offset = this.connectionsOffsetMap.get(side)![index];

    let x = this.container.position.x;
    let y = this.container.position.y;

    switch (side) {
      case EdgeAttachmentSide.TOP:
        x += offset;
        break;
      case EdgeAttachmentSide.BOTTOM:
        y += NODE_HEIGHT;
        x += offset;
        break;
      case EdgeAttachmentSide.LEFT:
        y += offset;
        break;
      case EdgeAttachmentSide.RIGHT:
        y += offset;
        x += NODE_WIDTH;
        break;
      default:
        break;
    }

    return {
      x,
      y,
    };
  }
}
