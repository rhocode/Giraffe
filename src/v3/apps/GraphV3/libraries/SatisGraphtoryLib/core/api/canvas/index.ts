import stringGen from 'v3/utils/stringGen';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';

export const addObjectChildren = (
  children: NodeTemplate[],
  canvasId: string
) => {
  pixiJsStore.update((t) => {
    children.forEach((child) => {
      const id = child.nodeId || stringGen(10);
      const s = t[canvasId];
      s.childrenMap.set(id, child);
      s.children.push(child);
      s.viewportChildContainer.addChild(child.container);
    });
  });
};

export const addChild = (child: PIXI.DisplayObject, canvasId: string) => {
  const id = stringGen(10);
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

export const getChildrenFromState = (state: any): any[] => {
  return state.children;
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
