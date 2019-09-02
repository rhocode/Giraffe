import {
  defaultNodeThemeSprite,
  defaultNodeThemeSpriteOutline,
  drawPath
} from '../../themes/nodeStyle';
import { GraphEdge } from './graphEdge';
import { imageRepository } from '../../repositories/imageRepository';
import * as protobuf from 'protobufjs/light';
import getLatestSchema from '../../utils/getLatestSchema';
import * as d3 from 'd3';

type Nullable<T> = T | null;

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
  lastTransform = d3.zoomIdentity;
  private lastWidth = 0;
  private lastHeight = 0;

  // These are filled in during render time to cache the assigned output slots
  inputSlotMapping: any = {};
  outputSlotMapping: any = {};

  protected constructor(x: number, y: number) {
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
    this.setCanvasDimensions();
    this.preRender();
  }

  setSelected(option: boolean) {
    this.selected = option;
  }

  fixPosition() {
    this.fx = this.x - this.width / 2;
    this.fy = this.y - this.height / 2;
    this.x = this.x - this.width / 2;
    this.y = this.y - this.height / 2;
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
    const upperX = this.fx + this.width;
    const lowerY = this.fy + this.yRenderBuffer;
    const upperY = this.fy + this.height;

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

  setCanvasDimensions(): void {
    const transformObj = { k: 10 };
    this.canvas.width = (this.width + 2 * this.xRenderBuffer) * transformObj.k;
    this.canvas.height =
      (this.height + 2 * this.yRenderBuffer) * transformObj.k;

    this.canvasOutlined.width = this.canvas.width;
    this.canvasOutlined.height = this.canvas.height;

    this.zoomedCanvas.width = (this.width + 2 * this.xRenderBuffer) * 10;
    this.zoomedCanvas.height = (this.height + 2 * this.yRenderBuffer) * 10;

    this.zoomedCanvasOutlined.width = this.zoomedCanvas.width;
    this.zoomedCanvasOutlined.height = this.zoomedCanvas.height;

    this.lastWidth = this.width;
    this.lastHeight = this.height;
  }

  clearCanvases(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.contextOutlined.clearRect(
      0,
      0,
      this.canvasOutlined.width,
      this.canvasOutlined.height
    );
    this.zoomedContext.clearRect(
      0,
      0,
      this.zoomedCanvas.width,
      this.zoomedCanvas.height
    );
    this.zoomedContextOutlined.clearRect(
      0,
      0,
      this.zoomedCanvasOutlined.width,
      this.zoomedCanvasOutlined.height
    );
  }

  preRender(transform: any = null): void {
    const transformObj = transform || { k: 1 };

    if (this.lastHeight !== this.height || this.lastWidth !== this.width) {
      this.setCanvasDimensions();
    } else {
      if (
        this.lastTransform.k !== transformObj.k ||
        this.lastTransform.x !== transformObj.x ||
        this.lastTransform.y !== transformObj.y
      ) {
        this.lastTransform = transformObj;
        this.clearCanvases();
        this.context.scale(transformObj.k, transformObj.k);
        this.contextOutlined.scale(transformObj.k, transformObj.k);
      }
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

  sortOutputSlots = () => {
    this.outputSlots.sort(
      (ea: Nullable<GraphEdge>, eb: Nullable<GraphEdge>): number => {
        if (eb === null) {
          return -1;
        }
        if (ea === null) {
          return 1;
        }

        const a = ea.targetNode;
        const b = eb.targetNode;

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

        const a = ea.sourceNode;
        const b = eb.sourceNode;

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

  abstract drawPathToTarget(context: any, target: GraphEdge): void;

  sortSlots = () => {
    this.sortInputSlots();
    this.sortOutputSlots();
  };

  sortConnectedNodeSlots = () => {
    const nodeSorted: any = {};
    this.inputSlots.forEach(edge => {
      if (!edge) return;
      const node = edge.sourceNode;
      nodeSorted[node.id] = nodeSorted[node.id] + 1 || 0;
      if (!nodeSorted[node.id]) {
        node.sortOutputSlots();
      }
    });
    this.outputSlots.forEach(edge => {
      if (!edge) return;
      const node = edge.targetNode;
      if (!nodeSorted[node.id]) {
        node.sortInputSlots();
      }
    });
  };

  abstract getImage(): any;

  abstract getTagLine(): string;

  abstract getVersion(): string;
}

export default class MachineNode extends GraphNode {
  overclock: number;
  machineId: number;
  width: number = 205;
  height: number = 155;
  xRenderBuffer: number = 15;
  yRenderBuffer: number = 15;
  machineObject: any;
  translator: any = null;
  renderedContexts: any = new Set();

  constructor(
    machineObject: any,
    overclock: number,
    x: number,
    y: number,
    fixPosition = false,
    translator = null
  ) {
    super(x, y);
    this.machineObject = JSON.parse(JSON.stringify(machineObject));
    this.machineId = machineObject ? machineObject.class.id : 0;
    this.overclock = overclock;
    this.inputSlots = [null, null, null];
    this.outputSlots = [null, null, null];
    this.renderedContexts = new Set();

    if (this.machineObject && this.machineObject.class) {
      console.error('ALL DONE!!!!');
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
  }

  drawPathToTarget(context: any, target: GraphEdge): void {
    drawPath(context, this, target);
  }

  serialize() {
    if (!this.machineObject) {
      this.machineObject = {
        recipe: 'iron_ingot_alloy',
        class: {
          name: 'foundry',
          icon: '/static/media/Foundry.23ceb7cd.png',
          hasUpgrades: true,
          id: 5,
          inputs: 2,
          outputs: 1,
          recipes: [
            {
              id: 'alternate_electromagnetic_control_rod',
              name: 'enriched_steel_ingot',
              input: [
                { item: { name: 'iron_ore' }, itemQuantity: 6 },
                {
                  item: { name: 'compacted_coal' },
                  itemQuantity: 3
                }
              ],
              output: [{ item: { name: 'steel_ingot' }, itemQuantity: 6 }]
            },
            {
              id: 'iron_ingot_alloy',
              name: 'alternate:_steel_ingot',
              input: [
                { item: { name: 'iron_ingot' }, itemQuantity: 3 },
                {
                  item: { name: 'coal' },
                  itemQuantity: 6
                }
              ],
              output: [{ item: { name: 'steel_ingot' }, itemQuantity: 6 }]
            },
            {
              id: 'alternate_plastic',
              name: 'iron_ingot_alloy',
              input: [
                { item: { name: 'iron_ore' }, itemQuantity: 1 },
                {
                  item: { name: 'copper_ore' },
                  itemQuantity: 1
                }
              ],
              output: [{ item: { name: 'iron_ingot' }, itemQuantity: 3 }]
            },
            {
              id: 'supercomputer',
              name: 'aluminum_ingot',
              input: [
                { item: { name: 'bauxite' }, itemQuantity: 7 },
                {
                  item: { name: 'silica' },
                  itemQuantity: 6
                }
              ],
              output: [{ item: { name: 'aluminum_ingot' }, itemQuantity: 2 }]
            },
            {
              id: 'uranium_cell',
              name: 'steel_ingot',
              input: [
                { item: { name: 'iron_ore' }, itemQuantity: 3 },
                { item: { name: 'coal' }, itemQuantity: 3 }
              ],
              output: [{ item: { name: 'steel_ingot' }, itemQuantity: 2 }]
            }
          ],
          instances: [
            { tier: { name: 'MK1', value: 0 } },
            { tier: { name: 'MK2', value: 1 } }
          ]
        },
        tier: 'MK2'
      };
    }

    return {
      ...super.serialize(),
      machineClass: this.machineObject.class.name,
      recipe: this.machineObject.recipe,
      tier: this.machineObject.tier,
      overclock: this.overclock,
      machineId: this.machineId
    };
  }

  getImage() {
    const root = protobuf.Root.fromJSON(getLatestSchema());
    const MachineClass = root.lookupEnum('MachineClass');

    const name = MachineClass.valuesById[this.machineId] || 'miner_mk1';
    return (
      imageRepository.machines[name] || imageRepository.machines['miner_mk1']
    );
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

  preRender(transform: any, debugContext: any = this.context): void {
    const transformObj = transform || { k: 1, x: 0, y: 0 };
    if (
      (this.renderedContexts && !this.renderedContexts.has(debugContext)) ||
      this.lastTransform.k !== transformObj.k
    ) {
      if (this.renderedContexts) {
        this.renderedContexts.add(debugContext);
      }
      this.lastTransform = transform;
      // //TODO: fix the prerendering
      debugContext.save();
      this.contextOutlined.save();
      this.zoomedContext.save();
      this.zoomedContextOutlined.save();
      super.preRender(transform);
      defaultNodeThemeSprite(debugContext, this);
      defaultNodeThemeSpriteOutline(this.contextOutlined, this);

      this.zoomedContextOutlined.scale(10, 10);
      this.zoomedContext.scale(10, 10);
      defaultNodeThemeSprite(this.zoomedContext, this);
      defaultNodeThemeSpriteOutline(this.zoomedContextOutlined, this);

      this.zoomedContextOutlined.restore();
      this.zoomedContext.restore();
      debugContext.restore();
      this.contextOutlined.restore();
      console.log('Prerendering call');
    }
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
