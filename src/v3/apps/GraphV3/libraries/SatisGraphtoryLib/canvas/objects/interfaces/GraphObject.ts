import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import EventEmitter from 'eventemitter3';
import uuidGen from 'v3/utils/stringUtils';

export abstract class GraphObjectContainer extends PIXI.Container {
  highLight: any = null;
  id: string = uuidGen();

  abstract getBounds(): any;

  getInheritedBounds() {
    return super.getBounds();
  }

  setHighLightObject(highLight: any) {
    this.highLight = highLight;
  }

  getHighLight() {
    return this.highLight;
  }

  setHighLightOn(state: boolean) {
    if (this.highLight?.visible !== state) {
      this.highLight.visible = state;
    }
  }
}

type GraphObjectProps = {
  theme?: any;
};

export abstract class GraphObject {
  abstract id: string;
  abstract container: GraphObjectContainer;
  eventEmitter: EventEmitter | null = null;

  constructor(props: GraphObjectProps) {
    this.theme = props.theme;
  }

  attachEventEmitter(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  abstract removeInteractionEvents(): void;
  abstract addSelectEvents(onSelectObjects: (ids: string[]) => any): void;
  abstract addDragEvents(): any[];
  abstract delete(): GraphObject[];
  theme: any = {};

  updateTheme(theme: any) {
    this.theme = theme;
  }
}
