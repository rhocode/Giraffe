import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

export class EmptyEdge extends EdgeTemplate {
  addDragEvents(): any[] {
    return [];
  }

  addSelectEvents(onSelectObjects: (ids: string[]) => any): void {}

  disableHitBox(): void {}

  enableHitBox(): void {}

  removeInteractionEvents(): void {}

  update(): void {}
  updateWithoutHitBox(): void {}
}
