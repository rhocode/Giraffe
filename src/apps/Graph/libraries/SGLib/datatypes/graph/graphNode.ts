import {
  defaultNodeThemeSprite,
  defaultNodeThemeSpriteOutline,
  drawPath
} from '../../themes/nodeStyle';
import { GraphEdge } from './graphEdge';
import { imageRepository } from '../../repositories/imageRepository';
import * as d3 from 'd3';
import Fraction from '../primitives/fraction';

type Nullable<T> = T | null;

const zoomedCanvasRatio = 3;
export const maxCanvasRatio = 8;

export abstract class GraphNode {
  static nextMachineNodeId: number = 0;
  id: number;
  fx: number;
  fy: number;
  x: number;
  y: number;
  selected: boolean = false;
  inputSlots: Nullable<GraphEdge>[] = [];
  outputSlots: Nullable<GraphEdge>[] = [];
  canvas: any;
  context: any;
  canvasOutlined: any;
  contextOutlined: any;
  zoomedCanvas: any;
  zoomedContext: any;
  zoomedCanvasOutlined: any;
  zoomedContextOutlined: any;
  abstract width: number;
  abstract height: number;
  abstract xRenderBuffer: number;
  abstract yRenderBuffer: number;
  k: number = 1;
  cacheInitialized: boolean = false;
  inputPropagationData: Map<number, Fraction> = new Map();
  outputPropagationData: Map<number, Fraction> = new Map();
  translator: Nullable<(s: string) => string> = str => str;

  // These are filled in during render time to cache the assigned output slots
  inputSlotMapping: any = {};
  outputSlotMapping: any = {};

  protected constructor(x: number, y: number, translator: any = null) {
    this.id = GraphNode.nextMachineNodeId++;
    this.fx = x;
    this.fy = y;
    this.x = x;
    this.y = y;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvasOutlined = document.createElement('canvas');
    this.contextOutlined = this.canvasOutlined.getContext('2d');

    this.zoomedCanvas = document.createElement('canvas');
    this.zoomedContext = this.zoomedCanvas.getContext('2d');

    this.zoomedCanvasOutlined = document.createElement('canvas');
    this.zoomedContextOutlined = this.zoomedCanvasOutlined.getContext('2d');
    this.translator = translator;
  }

  setSelected(option: boolean) {
    this.selected = option;
  }

  clearPropagationData() {
    this.inputPropagationData = new Map();
    this.outputPropagationData = new Map();
  }

  setPropagationData(
    inputData: Map<number, Fraction>,
    outputData: Map<number, Fraction>
  ) {
    this.inputPropagationData = inputData;
    this.outputPropagationData = outputData;
  }

  fixPosition() {
    this.fx = this.x - this.xRenderBuffer - +this.width / 2;
    this.fy = this.y - this.yRenderBuffer - this.height / 2;
    this.x = this.fx;
    this.y = this.fy;
  }

  serialize() {
    return {
      id: this.id,
      fx: this.fx,
      fy: this.fy
    };
  }

  public intersectsPoint(x: number, y: number) {
    const lowerX = this.fx + this.xRenderBuffer;
    const upperX = lowerX + this.width;
    const lowerY = this.fy + this.yRenderBuffer;
    const upperY = lowerY + this.height;

    return lowerX <= x && x <= upperX && (lowerY <= y && y <= upperY);
  }

  public intersectsRect(x1: number, y1: number, x2: number, y2: number) {
    const lowerXRect = Math.min(x1, x2);
    const upperXRect = Math.max(x1, x2);
    const lowerYRect = Math.min(y1, y2);
    const upperYRect = Math.max(y1, y2);

    const lowerX = this.fx + this.xRenderBuffer;
    const upperX = this.fx + this.width;
    const lowerY = this.fy + this.yRenderBuffer;
    const upperY = this.fy + this.height;

    return (
      lowerXRect <= lowerX &&
      upperX <= upperXRect &&
      (lowerYRect <= lowerY && upperY <= upperYRect)
    );
  }

  abstract render(context: any, transform: any): void;

  abstract lowRender(context: any, selected: boolean): void;

  preRender(transform: any = null): void {
    const transformObj = transform || { k: 1 };
    this.canvas.width = (this.width + 2 * this.xRenderBuffer) * transformObj.k;
    this.canvas.height =
      (this.height + 2 * this.yRenderBuffer) * transformObj.k;

    this.canvasOutlined.width = this.canvas.width;
    this.canvasOutlined.height = this.canvas.height;

    if (!this.cacheInitialized) {
      this.cacheInitialized = true;
      this.zoomedCanvas.width =
        (this.width + 2 * this.xRenderBuffer) * zoomedCanvasRatio;
      this.zoomedCanvas.height =
        (this.height + 2 * this.yRenderBuffer) * zoomedCanvasRatio;

      this.zoomedCanvasOutlined.width = this.zoomedCanvas.width;
      this.zoomedCanvasOutlined.height = this.zoomedCanvas.height;
    }

    if (transform) {
      this.context.scale(transform.k, transform.k);
      this.contextOutlined.scale(transform.k, transform.k);
    }
  }

  setSource(source: GraphEdge, index: number): void {
    if (this.inputSlots[index]) {
      throw new Error('Source index is not null!');
    }
    this.inputSlots[index] = source;
  }

  setTarget(target: GraphEdge, index: number): void {
    if (this.outputSlots[index]) {
      throw new Error('Target index is not null!');
    }
    this.outputSlots[index] = target;
  }

  addSource(source: GraphEdge) {
    const nextNullIndex: number = this.inputSlots.indexOf(null);
    if (nextNullIndex === -1) {
      throw new Error(
        `GraphNode ${this.id} is full of inputSlots and cannot add ${source.id}`
      );
    }

    this.inputSlots[nextNullIndex] = source;
  }

  addTarget(target: GraphEdge) {
    const nextNullIndex: number = this.outputSlots.indexOf(null);
    if (nextNullIndex === -1) {
      throw new Error(
        `GraphNode ${this.id} is full of outputSlots and cannot add ${target.id}`
      );
    }

    this.outputSlots[nextNullIndex] = target;
  }

  addTargetAtIndex(target: GraphEdge, index: number) {
    this.outputSlots[index] = target;
  }

  addSourceAtIndex(source: GraphEdge, index: number) {
    this.inputSlots[index] = source;
  }

  sortOutputSlots = () => {
    this.outputSlots.sort(
      (ea: Nullable<GraphEdge>, eb: Nullable<GraphEdge>): number => {
        if (eb === null) {
          return -1;
        }
        if (ea === null) {
          return 1;
        }

        const a = ea.target;
        const b = eb.target;

        const yA = a.fy - this.fy;
        const xA = a.fx - this.fx;
        const yB = b.fy - this.fy;
        const xB = b.fx - this.fx;

        if (yB / xB === yA / xA) {
          return ea.id - eb.id;
          // return Math.abs(Math.hypot(xA, yA)) - Math.abs(Math.hypot(xB, yB));
        }

        return yA / xA - yB / xB;
      }
    );
  };

  sortInputSlots = () => {
    this.inputSlots.sort(
      (ea: Nullable<GraphEdge>, eb: Nullable<GraphEdge>): number => {
        if (eb === null) {
          return -1;
        }
        if (ea === null) {
          return 1;
        }

        const a = ea.source;
        const b = eb.source;

        const yA = this.fy - a.fy;
        const xA = this.fx - a.fx;
        const yB = this.fy - b.fy;
        const xB = this.fx - b.fx;

        if (yB / xB === yA / xA) {
          return ea.id - eb.id;
          // return Math.abs(Math.hypot(xA, yA)) - Math.abs(Math.hypot(xB, yB));
        }

        return yB / xB - yA / xA;
      }
    );
  };

  abstract drawEdgePath(context: any, edge: GraphEdge): void;

  sortSlots = () => {
    this.sortInputSlots();
    this.sortOutputSlots();
  };

  sortConnectedNodeSlots = () => {
    const nodeSorted: any = {};
    this.inputSlots.forEach(edge => {
      if (!edge) return;
      const node = edge.source;
      nodeSorted[node.id] = nodeSorted[node.id] + 1 || 0;
      if (!nodeSorted[node.id]) {
        node.sortOutputSlots();
      }
    });
    this.outputSlots.forEach(edge => {
      if (!edge) return;
      const node = edge.target;
      if (!nodeSorted[node.id]) {
        node.sortInputSlots();
      }
    });
  };

  abstract getImage(): any;

  abstract getTagLine(): string;

  abstract getVersion(): string;

  getTranslation(str: string): string {
    if (this.translator) {
      return this.translator(str);
    }
    return str;
  }
}

type MachineClass = {
  id: number; // deprecate in favor of name directly?
  inputs: number;
  outputs: number;
  name: String;
};

type MachineObject = {
  class: MachineClass;
  recipe: String;
  tier: String;
};

export default class MachineNode extends GraphNode {
  overclock: number;
  readonly width: number = 205;
  readonly height: number = 140;
  xRenderBuffer: number = 100;
  yRenderBuffer: number = 100;
  machineObject: any;

  constructor(
    machineObject: MachineObject,
    overclock: number,
    x: number,
    y: number,
    fixPosition = false,
    translator = null,
    initialTransform = d3.zoomIdentity,
    internalId: number = -1
  ) {
    super(x, y, translator);

    if (internalId !== -1) {
      this.id = internalId;
      if (GraphNode.nextMachineNodeId <= internalId) {
        GraphNode.nextMachineNodeId = internalId + 1;
      }
    }

    this.machineObject = { ...machineObject };
    this.overclock = overclock;
    this.inputSlots = [null, null, null];
    this.outputSlots = [null, null, null];

    if (this.machineObject && this.machineObject.class) {
      this.inputSlots = [];
      this.outputSlots = [];

      for (let i = 0; i < this.machineObject.class.inputs; i++) {
        this.inputSlots.push(null);
      }
      for (let i = 0; i < this.machineObject.class.outputs; i++) {
        this.outputSlots.push(null);
      }
    }

    this.translator = translator;

    if (fixPosition) {
      this.fixPosition();
    }

    this.getImage();

    this.initialRender(initialTransform);
  }

  drawEdgePath(context: any, edge: GraphEdge): void {
    edge.updateCoordinates();
    drawPath(context, edge);
  }

  serialize() {
    return {
      ...super.serialize(),
      machineClass: this.machineObject.class.name,
      recipe: this.machineObject.recipe,
      tier: this.machineObject.tier,
      overclock: this.overclock
    };
  }

  getResourceImage(itemId: number) {
    //
    // const tieredChoice = imageRepository.items[itemId];
    // const baseChoice = imageRepository.machines[name];
    //
    // if (tieredChoice) {
    //   return tieredChoice;
    // }
    //
    // if (baseChoice) {
    //   return baseChoice;
    // }
    //
    // return imageRepository.machines['miner_mk1'];
  }

  getImage() {
    const baseName = this.machineObject.class.name;
    const baseNameWithTier =
      this.machineObject.class.name + '_' + this.machineObject.tier;
    const name = baseName || 'miner_mk1';

    const tieredChoice = imageRepository.machines[baseNameWithTier];
    const baseChoice = imageRepository.machines[name];

    if (tieredChoice) {
      return tieredChoice;
    }

    if (baseChoice) {
      return baseChoice;
    }

    return imageRepository.machines['miner_mk1'];
  }

  getTagLine() {
    const translate =
      this.translator ||
      function(a: any) {
        return a;
      };
    if (this.machineObject && this.machineObject.recipe) {
      return translate(this.machineObject.recipe);
    }

    return translate('no_production');
  }

  getVersion() {
    const translate =
      this.translator ||
      function(a: any) {
        return a;
      };
    if (this.machineObject && this.machineObject.tier) {
      return translate(this.machineObject.tier);
    }

    return '';
  }

  initialRender(initialTransform: any): void {
    this.preRender(initialTransform);
  }

  preRender(transform: any, dataLibrary: any = null): void {
    const mainContext: any = this.context;

    //TODO: fix the prerendering
    mainContext.save();
    this.contextOutlined.save();
    this.zoomedContext.save();
    this.zoomedContextOutlined.save();
    super.preRender(transform);
    defaultNodeThemeSprite(mainContext, this, dataLibrary);
    defaultNodeThemeSpriteOutline(this.contextOutlined, this);

    this.zoomedContextOutlined.scale(zoomedCanvasRatio, zoomedCanvasRatio);
    this.zoomedContext.scale(zoomedCanvasRatio, zoomedCanvasRatio);
    defaultNodeThemeSprite(this.zoomedContext, this, dataLibrary);
    defaultNodeThemeSpriteOutline(this.zoomedContextOutlined, this);

    this.zoomedContextOutlined.restore();
    this.zoomedContext.restore();
    mainContext.restore();
    this.contextOutlined.restore();
  }

  lowRender(context: any, selected: boolean = false): void {
    context.save();
    if (selected) {
      context.drawImage(
        this.zoomedCanvasOutlined,
        this.fx,
        this.fy,
        this.canvas.width,
        this.canvas.height
      );
    }
    context.drawImage(
      this.zoomedCanvas,
      this.fx,
      this.fy,
      this.canvas.width,
      this.canvas.height
    );
    context.restore();
  }

  render(context: any, transform: any, selected: boolean = false): void {
    context.save();
    if (selected) {
      context.drawImage(
        this.canvasOutlined,
        this.fx * transform.k,
        this.fy * transform.k
      );
    }
    context.drawImage(
      this.canvas,
      this.fx * transform.k,
      this.fy * transform.k
    );
    context.restore();
  }
}
