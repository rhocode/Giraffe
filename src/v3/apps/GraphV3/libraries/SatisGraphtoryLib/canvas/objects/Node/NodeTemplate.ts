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
  recipe: string;
  overclock: number;
  machineName: string;
  tier: number;
  container: NodeContainer;

  inputConnections: EdgeTemplate[] = [];
  outputConnections: EdgeTemplate[] = [];
  anyConnections: EdgeTemplate[] = [];

  connectionsOffsetMap: Map<EdgeAttachmentSide, number[]> = new Map();
  connectionsIndexMap: Map<EdgeTemplate, number> = new Map();
  connectionsSideMap: Map<EdgeTemplate, EdgeAttachmentSide> = new Map();

  protected constructor(props: SatisGraphtoryNodeProps) {
    super(props);

    const {
      id,
      position,
      inputConnections,
      outputConnections,
      anyConnections,
      recipeName,
      overclock,
      machineName,
      tier,
    } = props;

    this.recipe = recipeName;
    this.overclock = overclock;
    this.machineName = machineName;
    this.tier = tier;

    this.container = new NodeContainer();

    this.container.setTransform(position.x, position.y);

    this.id = id;
    this.container.id = id;

    // Sorting here is mostly useless.
    // TODO: figure out if we should just kill this if we don't do any weird operations when
    // passing in inputConnections and such
    if (inputConnections) {
      this.inputConnections = inputConnections;
      this.inputConnections.sort((a, b) => {
        return a.getAttachmentSide(this) - b.getAttachmentSide(this);
      });
    }

    if (outputConnections) {
      this.outputConnections = outputConnections;
      this.outputConnections.sort((a, b) => {
        return a.getAttachmentSide(this) - b.getAttachmentSide(this);
      });
    }

    if (anyConnections) {
      this.anyConnections = anyConnections;
      this.anyConnections.sort((a, b) => {
        return a.getAttachmentSide(this) - b.getAttachmentSide(this);
      });
    }
  }

  setPosition(x: number, y: number) {
    this.container.setTransform(x, y);
  }

  abstract addLinkEvents(
    onStartLinkEvent: Function | null,
    onEndLinkEvent: Function,
    cancelFunc: Function
  ): void;

  deleteEdge(edge: EdgeTemplate) {
    for (let i = 0; i < this.inputConnections.length; i++) {
      if (this.inputConnections[i] === edge) {
        this.inputConnections[i] = new EmptyEdge({
          resourceForm: edge.resourceForm,
          id: edge.id,
          externalInteractionManager: this.getInteractionManager(),
        });
        break;
      }
    }
    for (let i = 0; i < this.outputConnections.length; i++) {
      if (this.outputConnections[i] === edge) {
        this.outputConnections[i] = new EmptyEdge({
          resourceForm: edge.resourceForm,
          id: edge.id,
          externalInteractionManager: this.getInteractionManager(),
        });
        break;
      }
    }
    for (let i = 0; i < this.anyConnections.length; i++) {
      if (this.anyConnections[i] === edge) {
        this.anyConnections[i] = new EmptyEdge({
          resourceForm: edge.resourceForm,
          id: edge.id,
          biDirectional: true,
          externalInteractionManager: this.getInteractionManager(),
        });
        break;
      }
    }

    this.recalculateConnections();
  }

  delete(): GraphObject[] {
    const originalEdges = [
      ...this.inputConnections,
      ...this.outputConnections,
      ...this.anyConnections,
    ];
    for (const edge of this.inputConnections) {
      edge.delete();
    }

    for (const edge of this.outputConnections) {
      edge.delete();
    }

    for (const edge of this.anyConnections) {
      edge.delete();
    }

    this.container.destroy();
    return originalEdges;
  }

  // public findFirstEmpty(arr: EdgeTemplate[]) {
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i].sourceNode == null || arr[i].targetNode == null) {
  //       return i;
  //     }
  //   }
  //
  //   throw new Error('No empty index found');
  // }

  public findClosestEmpty(arr: EdgeTemplate[], otherNode: NodeTemplate) {
    const otherCoordinateX = otherNode.container.position.x + NODE_WIDTH / 2;
    const otherCoordinateY = otherNode.container.position.y + NODE_HEIGHT / 2;

    let min = Infinity;
    let side = -1;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].sourceNode == null || arr[i].targetNode == null) {
        const { x, y } = this.getConnectionCoordinate(arr[i]);
        const a = x - otherCoordinateX;
        const b = y - otherCoordinateY;

        const dist = Math.sqrt(a * a + b * b);
        if (dist < min) {
          min = dist;
          side = i;
        }
      }
    }

    if (side >= 0) return side;

    throw new Error('No empty index found');
  }

  isBiDirectional() {
    return this.anyConnections.length > 0;
  }

  addEdge(edge: EdgeTemplate, edgeType: EdgeType) {
    const otherNode =
      edge.sourceNode === this ? edge.targetNode : edge.sourceNode;

    if (!otherNode) throw new Error('Other node is null');

    if (edge.biDirectional) {
      const firstNull = this.findClosestEmpty(this.anyConnections, otherNode);
      const foundEdge = this.anyConnections[firstNull];
      this.anyConnections[firstNull] = foundEdge.replaceEdge(edge, edgeType);
    } else if (this.anyConnections.length) {
      // This is the special case where we have anyConnections but the pipe is NOT bidirectinal.
      // TODO: Fix this somehow
      const firstNull = this.findClosestEmpty(this.anyConnections, otherNode);

      const foundEdge = this.anyConnections[firstNull];
      this.anyConnections[firstNull] = foundEdge.replaceEdge(edge, edgeType);
    } else if (edgeType === EdgeType.INPUT) {
      const firstNull = this.findClosestEmpty(this.inputConnections, otherNode);
      const foundEdge = this.inputConnections[firstNull];
      this.inputConnections[firstNull] = foundEdge.replaceEdge(edge, edgeType);
    } else if (edgeType === EdgeType.OUTPUT) {
      const firstNull = this.findClosestEmpty(
        this.outputConnections,
        otherNode
      );
      const foundEdge = this.outputConnections[firstNull];
      this.outputConnections[firstNull] = foundEdge.replaceEdge(edge, edgeType);
    } else {
      console.log('Unimplemented!');
    }

    this.recalculateConnections();
  }

  abstract recalculateConnections(rearrange?: boolean): void;

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
      // edge.sourceNode.sortOutputEdges();
      edge.sourceNode.outputConnections.map((item) => item?.update());
      edge.update();
    });

    this.outputConnections.forEach((edge) => {
      if (!edge || !edge?.targetNode) return;
      // edge.targetNode.sortInputEdges();
      edge.targetNode.inputConnections.map((item) => item?.update());
      edge.update();
    });

    this.anyConnections.forEach((edge) => {
      if (!edge || !edge?.targetNode) return;
      // edge.targetNode.sortInputEdges();
      edge.targetNode.anyConnections.map((item) => item?.update());
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
