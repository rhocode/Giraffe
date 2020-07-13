import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import stringGen from 'v3/utils/stringGen';
import EdgeTemplate, {
  EdgeType,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  SatisGraphtoryCoordinate,
  SatisGraphtoryNodeProps,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import EventEmitter from 'eventemitter3';
import { sortFunction } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/sortEdges';

export class NodeContainer extends PIXI.Container {
  public boundCalculator: any = null;
  public nodeId: string = stringGen(10);
  public highLight: any = null;
}

export abstract class NodeTemplate {
  nodeId: string;
  container: NodeContainer;
  abstract inputMapping: any[];
  abstract outputMapping: any[];
  abstract inputX: number;
  abstract outputX: number;

  edgeMap: Map<string, number>;

  inEdges: (EdgeTemplate | null)[];
  outEdges: (EdgeTemplate | null)[];
  edges: EdgeTemplate[];

  eventEmitter: EventEmitter | null = null;
  x: number;
  y: number;

  // The offset to use for calculations of displacement
  offsetHookX: number;
  offsetHookY: number;

  protected constructor(props: SatisGraphtoryNodeProps) {
    const {
      nodeId,
      position,
      // recipeLabel,
      // tier,
      // overclock,
      // machineName,
      // machineLabel,
      inputs,
      outputs,
    } = props;

    this.x = position.x;
    this.y = position.y;

    this.offsetHookX = position.x;
    this.offsetHookY = position.y;

    const container = new NodeContainer();
    container.nodeId = nodeId;
    this.nodeId = nodeId;
    this.container = container;

    // TODO: what is in inputs?! maybe we need to fill this with inputs and outputs
    this.inEdges = new Array(inputs.length).fill(null);
    this.outEdges = new Array(outputs.length).fill(null);
    this.edges = [];
    this.edgeMap = new Map<string, number>();
  }

  attachEventEmitter(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  tempOm: any = null;
  tempIm: any = null;
  tempOx: number = 0;
  tempIx: number = 0;

  snapshotEdgePositions = () => {
    this.tempOm = [...this.outputMapping];
    this.tempIm = [...this.inputMapping];
    this.tempOx = this.outputX;
    this.tempIx = this.inputX;
  };

  updateEdgePositions = (dx: number, dy: number) => {
    this.outputMapping = this.outputMapping.map((item, index) => {
      if (item === null) return null;
      return this.tempOm[index] + dy;
    });

    this.inputMapping = this.inputMapping.map((item, index) => {
      if (item === null) return null;
      return this.tempIm[index] + dy;
    });

    this.outputX = this.tempOx + dx;
    this.inputX = this.tempIx + dx;
  };

  addEdge(edge: EdgeTemplate, edgeType: EdgeType) {
    this.edges.push(edge);
    if (edgeType === EdgeType.INPUT) {
      const firstNull = this.inEdges.indexOf(null);

      this.inEdges[firstNull] = edge;
      this.edgeMap.set(edge.edgeId, firstNull);
    } else if (edgeType === EdgeType.OUTPUT) {
      const firstNull = this.outEdges.indexOf(null);

      this.outEdges[firstNull] = edge;
      this.edgeMap.set(edge.edgeId, firstNull);
    } else {
      console.log('Unimplemented!');
    }
  }

  sortInputEdges() {
    this.inEdges.sort(sortFunction(this.offsetHookX, this.offsetHookY, -1));

    this.inEdges.forEach((item, index) => {
      if (!item) return;
      this.edgeMap.set(item.edgeId, index);
    });
  }

  sortOutputEdges() {
    this.outEdges.sort(sortFunction(this.offsetHookX, this.offsetHookY));

    this.outEdges.forEach((item, index) => {
      if (!item) return;
      this.edgeMap.set(item.edgeId, index);
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

  getOutputCoordinate(
    edgeId: string,
    edgeType: EdgeType
  ): SatisGraphtoryCoordinate {
    const index = this.edgeMap.get(edgeId)!;

    if (edgeType === EdgeType.OUTPUT) {
      return {
        x: this.outputX,
        y: this.outputMapping[index],
      };
    } else if (edgeType === EdgeType.INPUT) {
      return {
        x: this.inputX,
        y: this.inputMapping[index],
      };
    } else {
      throw new Error('Unimplemented');
    }
  }

  abstract addDragEvents(eventEmitter: EventEmitter): any[];
}
