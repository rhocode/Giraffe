import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import uuidGen from 'v3/utils/stringUtils';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';

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

export type GraphObjectProps = {
  externalInteractionManager: ExternalInteractionManager;
};

export abstract class GraphObject {
  abstract id: string;
  abstract container: GraphObjectContainer;

  private externalInteractionManager: ExternalInteractionManager;

  constructor(props: GraphObjectProps) {
    this.externalInteractionManager = props.externalInteractionManager;
  }

  getInteractionManager() {
    return this.externalInteractionManager;
  }

  abstract removeInteractionEvents(): void;
  abstract addSelectEvents(onSelectObjects: (ids: string[]) => any): void;
  abstract addDragEvents(): any[];
  abstract delete(): GraphObject[];
}
