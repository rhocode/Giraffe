import uuidGen from 'v3/utils/stringUtils';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { GraphObject } from '../../../canvas/objects/interfaces/GraphObject';

export const addObjectChildren = (
  children: NodeTemplate[] | EdgeTemplate[],
  canvasId: string,
  unshift: boolean = false
) => {
  pixiJsStore.update(addObjectChildrenWithinState(children, canvasId, unshift));
};

export const addObjectChildrenWithinState = (
  children: GraphObject[],
  canvasId: string,
  unshift: boolean = false
) => {
  return (t: any) => {
    children.forEach((child: GraphObject) => {
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
  };
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

export const removeChildrenFunction = (canvasId: string) => (t: any) => {
  const s = t[canvasId];
  s.childrenMap.clear();
  s.children.splice(0, s.children.length);
  s.viewportChildContainer.removeChildren();
};

export const removeAllChildren = (canvasId: string) => {
  pixiJsStore.update(removeChildrenFunction(canvasId));
};

export function getTypedChildrenFromState(state: any, type: any): any[] {
  return state.children.filter((item: any) => item instanceof type);
}

export function getMultiTypedChildrenFromState(
  state: any,
  type: any[],
  whitelistedIds = new Set<string>()
): any[] {
  return state.children.filter((item: any) => {
    let hasAttribute = type.some((subType: any) => {
      return item instanceof subType;
    });

    if (whitelistedIds.size) {
      return whitelistedIds.has(item.id) && hasAttribute;
    }

    return hasAttribute;
  });
}

export const getChildFromStateById = (state: any, id: string): any => {
  return state.childrenMap.get(id);
};
