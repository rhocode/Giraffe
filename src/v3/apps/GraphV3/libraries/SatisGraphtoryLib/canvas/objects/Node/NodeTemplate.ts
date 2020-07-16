import EdgeTemplate, {
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  SatisGraphtoryCoordinate,
  SatisGraphtoryNodeProps,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { sortFunction } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/sortEdges';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';

export class NodeContainer extends GraphObjectContainer {
  public boundCalculator: any = null;

  getBounds = (): any => {
    return this.boundCalculator?.getBounds();
  };
}

export abstract class NodeTemplate extends GraphObject {
  id: string;
  abstract inputMapping: any[];
  abstract outputMapping: any[];
  abstract inputX: number;
  abstract outputX: number;
  container: NodeContainer;

  edgeMap: Map<string, number>;

  inEdges: (EdgeTemplate | null)[];
  outEdges: (EdgeTemplate | null)[];
  edges: EdgeTemplate[];

  protected constructor(props: SatisGraphtoryNodeProps) {
    super();

    const { id, position, inputs, outputs } = props;

    this.container = new NodeContainer();

    this.container.setTransform(position.x, position.y);

    this.id = id;
    this.container.id = id;

    // TODO: what is in inputs?! maybe we need to fill this with inputs and outputs
    this.inEdges = new Array(inputs.length).fill(null);
    this.outEdges = new Array(outputs.length).fill(null);
    this.edges = [];
    this.edgeMap = new Map<string, number>();
  }

  addEdge(edge: EdgeTemplate, edgeType: EdgeType) {
    this.edges.push(edge);
    if (edgeType === EdgeType.INPUT) {
      const firstNull = this.inEdges.indexOf(null);

      this.inEdges[firstNull] = edge;
      this.edgeMap.set(edge.id, firstNull);
    } else if (edgeType === EdgeType.OUTPUT) {
      const firstNull = this.outEdges.indexOf(null);

      this.outEdges[firstNull] = edge;
      this.edgeMap.set(edge.id, firstNull);
    } else {
      console.log('Unimplemented!');
    }
  }

  sortInputEdges() {
    this.inEdges.sort(
      sortFunction(this.container.position.x, this.container.position.y, -1)
    );

    this.inEdges.forEach((item, index) => {
      if (!item) return;
      this.edgeMap.set(item.id, index);
    });
  }

  sortOutputEdges() {
    this.outEdges.sort(
      sortFunction(this.container.position.x, this.container.position.y)
    );

    this.outEdges.forEach((item, index) => {
      if (!item) return;
      this.edgeMap.set(item.id, index);
    });
  }

  updateEdges = () => {
    this.inEdges.forEach((edge) => {
      if (!edge) return;
      edge.sourceNode.sortOutputEdges();
      edge.sourceNode.outEdges.map((item) => item?.update());
      edge.update();
    });

    this.outEdges.forEach((edge) => {
      if (!edge) return;
      edge.targetNode.sortInputEdges();
      edge.targetNode.inEdges.map((item) => item?.update());
      edge.update();
    });
  };

  getConnectionCoordinate(
    edgeId: string,
    edgeType: EdgeType
  ): SatisGraphtoryCoordinate {
    const index = this.edgeMap.get(edgeId)!;

    if (edgeType === EdgeType.OUTPUT) {
      return {
        x: this.container.position.x + this.outputX,
        y: this.container.position.y + this.outputMapping[index],
      };
    } else if (edgeType === EdgeType.INPUT) {
      return {
        x: this.container.position.x + this.inputX,
        y: this.container.position.y + this.inputMapping[index],
      };
    } else {
      throw new Error('Unimplemented');
    }
  }
}
