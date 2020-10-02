import uuidGen from 'v3/utils/stringUtils';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

export const addObjectChildren = (
  children: NodeTemplate[] | EdgeTemplate[],
  canvasId: string,
  unshift: boolean = false
) => {
  pixiJsStore.update((t) => {
    children.forEach((child: NodeTemplate | EdgeTemplate) => {
      const id = child.id || uuidGen();
      const s = t[canvasId];
      s.childrenMap.set(id, child);
      if (unshift) {
        s.children.unshift(child);
        s.viewportChildContainer.addChildAt(child.container, 0);
      } else {
        s.children.push(child);
        s.viewportChildContainer.addChild(child.container);
      }
    });
  });
};

export const addChild = (child: PIXI.DisplayObject, canvasId: string) => {
  const id = uuidGen();
  pixiJsStore.update((t) => {
    const s = t[canvasId];
    s.childrenMap.set(id, child);
    s.children.push(child);
    s.viewportChildContainer.addChild(child);
  });

  return id;
};

export const removeChild = (id: string, canvasId: string) => {
  pixiJsStore.update((t) => {
    const s = t[canvasId];

    if (!s.childrenMap.get(id)) {
      throw new Error('Unknown child ' + id);
    }

    const childToRemove = s.childrenMap.get(id)!;
    s.childrenMap.delete(id);
    s.children.splice(s.children.indexOf(childToRemove), 1);
    s.viewportChildContainer.removeChild(childToRemove);
  });
};

export function getTypedChildrenFromState(state: any, type: any): any[] {
  return state.children.filter((item: any) => item instanceof type);
}

export function getMultiTypedChildrenFromState(state: any, type: any[]): any[] {
  return state.children.filter((item: any) => {
    return type.some((subType: any) => {
      return item instanceof subType;
    });
  });
}

export const getChildFromStateById = (state: any, id: string): any => {
  return state.childrenMap.get(id);
};