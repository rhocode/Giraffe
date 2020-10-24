import EventEmitter from 'eventemitter3';

class ExternalInteractionManager {
  private theme: any = {};
  private readonly eventEmitter: EventEmitter;
  private eventEmitterMap = new Map<string, boolean>();
  private canvasId: string;

  constructor(eventEmitter: EventEmitter, theme: any, canvasId: string) {
    this.eventEmitter = eventEmitter;
    this.theme = theme;
    this.canvasId = canvasId;
  }

  getCanvasId() {
    return this.canvasId;
  }

  getEventEmitter() {
    // if (!this.eventEmitterIsEnabled) throw new Error("Cannot get event emitter when it is disabled")

    return this.eventEmitter;
  }

  eventEmitterEnabled(id: string) {
    return this.eventEmitterMap.get(id) || false;
  }

  enableEventEmitter(id: string) {
    this.eventEmitterMap.set(id, true);
  }

  disableEventEmitter(id: string) {
    this.eventEmitterMap.delete(id);
  }

  setTheme(theme: any) {
    this.theme = theme;
  }

  getTheme() {
    return this.theme;
  }
}

export default ExternalInteractionManager;
