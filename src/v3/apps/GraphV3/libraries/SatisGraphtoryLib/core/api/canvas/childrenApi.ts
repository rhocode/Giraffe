import uuidGen from 'v3/utils/stringUtils';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { GraphObject } from '../../../canvas/objects/interfaces/GraphObject';
import { GlobalGraphAppStore } from '../../../stores/GlobalGraphAppStore';

// This function is a wrapper function that needs the global canvas state in order to properly
// add children
export const addGraphChildrenFromWithinStateUpdate = (
  children: GraphObject[],
  canvasId: string,
  addAtFront: boolean = false
) => {
  return (globalCanvasState: any) => {
    const s = globalCanvasState[canvasId];
    children.forEach((child: GraphObject) => {
      const id = child.id || uuidGen();
      s.childrenMap.set(id, child);
      if (addAtFront) {
        s.children.unshift(child);
        s.viewportChildContainer.addChildAt(child.container, 0);
      } else {
        s.children.push(child);
        s.viewportChildContainer.addChild(child.container);
      }
    });
  };
};

export const addGraphChildren = (
  children: NodeTemplate[] | EdgeTemplate[],
  canvasId: string,
  unshift: boolean = false
) => {
  GlobalGraphAppStore.update(
    addGraphChildrenFromWithinStateUpdate(children, canvasId, unshift)
  );
};

export const removeAllGraphChildrenFromWithinStateUpdate = (
  canvasId: string
) => (globalGraphState: any) => {
  const state = globalGraphState[canvasId];
  state.childrenMap.clear();
  state.children = [];
  state.viewportChildContainer.removeChildren();
};

export const addPixiDisplayObject = (
  child: PIXI.DisplayObject,
  canvasId: string
) => {
  const id = uuidGen();
  GlobalGraphAppStore.update((globalGraphState) => {
    const s = globalGraphState[canvasId];
    s.childrenMap.set(id, child);
    s.children.push(child);
    s.viewportChildContainer.addChild(child);
  });

  return id;
};

export const removePixiDisplayObject = (id: string, canvasId: string) => {
  GlobalGraphAppStore.update((globalGraphState) => {
    const s = globalGraphState[canvasId];

    if (!s.childrenMap.get(id)) {
      throw new Error('Unknown child ' + id);
    }

    const childToRemove = s.childrenMap.get(id)!;
    s.childrenMap.delete(id);
    s.children.splice(s.children.indexOf(childToRemove), 1);
    s.viewportChildContainer.removeChild(childToRemove as any);
  });
};

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

export const getChildFromCanvasState = (canvasState: any, id: string): any => {
  return canvasState.childrenMap.get(id);
};

//
// export const addObjectChildren = (
//   children: NodeTemplate[] | EdgeTemplate[],
//   canvasId: string,
//   unshift: boolean = false
// ) => {
//   pixiJsStore.update(addObjectChildrenWithinState(children, canvasId, unshift));
// };
//
// export const addObjectChildrenWithinState = (
//   children: GraphObject[],
//   canvasId: string,
//   unshift: boolean = false
// ) => {
//   return (t: any) => {
//     children.forEach((child: GraphObject) => {
//       const id = child.id || uuidGen();
//       const s = t[canvasId];
//       s.childrenMap.set(id, child);
//       if (unshift) {
//         s.children.unshift(child);
//         s.viewportChildContainer.addChildAt(child.container, 0);
//       } else {
//         s.children.push(child);
//         s.viewportChildContainer.addChild(child.container);
//       }
//     });
//   };
// };
//
// export const addChild = (child: PIXI.DisplayObject, canvasId: string) => {
//   const id = uuidGen();
//   pixiJsStore.update((t) => {
//     const s = t[canvasId];
//     s.childrenMap.set(id, child);
//     s.children.push(child);
//     s.viewportChildContainer.addChild(child);
//   });
//
//   return id;
// };
//
// export const removeChild = (id: string, canvasId: string) => {
//   pixiJsStore.update((t) => {
//     const s = t[canvasId];
//
//     if (!s.childrenMap.get(id)) {
//       throw new Error('Unknown child ' + id);
//     }
//
//     const childToRemove = s.childrenMap.get(id)!;
//     s.childrenMap.delete(id);
//     s.children.splice(s.children.indexOf(childToRemove), 1);
//     s.viewportChildContainer.removeChild(childToRemove);
//   });
// };
//
// export const removeChildrenFunction = (canvasId: string) => (t: any) => {
//   const s = t[canvasId];
//   s.childrenMap.clear();
//   s.children.splice(0, s.children.length);
//   s.viewportChildContainer.removeChildren();
// };
//
// export const removeAllChildren = (canvasId: string) => {
//   pixiJsStore.update(removeChildrenFunction(canvasId));
// };
//
// export function getTypedChildrenFromState(state: any, type: any): any[] {
//   return state.children.filter((item: any) => item instanceof type);
// }
//
// export function getMultiTypedChildrenFromState(
//   state: any,
//   type: any[],
//   whitelistedIds = new Set<string>()
// ): any[] {
//   return state.children.filter((item: any) => {
//     let hasAttribute = type.some((subType: any) => {
//       return item instanceof subType;
//     });
//
//     if (whitelistedIds.size) {
//       return whitelistedIds.has(item.id) && hasAttribute;
//     }
//
//     return hasAttribute;
//   });
// }
//
// export const getChildFromStateById = (state: any, id: string): any => {
//   return state.childrenMap.get(id);
// };
