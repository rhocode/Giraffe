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
      s.children.set(id, child);
      s.viewportChildContainer.addChild(child.container);
    });
  });
};

// export const addChildren = (
//   children: PIXI.DisplayObject[],
//   canvasId: string
// ) => {
//   pixiJsStore.update((t) => {
//     children.forEach((child) => {
//       const id = stringGen(10);
//       const s = t[canvasId];
//       s.children.set(id, child);
//       s.viewportChildContainer.addChild(child);
//     });
//   });
// };

// export const addObjectChild = (child: NodeTemplate, canvasId: string) => {
//   const id = stringGen(10);
//   pixiJsStore.update((t) => {
//     const s = t[canvasId];
//     s.children.set(id, child);
//     s.viewportChildContainer.addChild(child.container);
//   });
//
//   return id;
// };

export const addChild = (child: PIXI.DisplayObject, canvasId: string) => {
  const id = stringGen(10);
  pixiJsStore.update((t) => {
    const s = t[canvasId];
    s.children.set(id, child);
    s.viewportChildContainer.addChild(child);
  });

  return id;
};

export const removeChild = (id: string, canvasId: string) => {
  pixiJsStore.update((t) => {
    const s = t[canvasId];

    if (!s.children.get(id)) {
      throw new Error('Unknown child ' + id);
    }

    const childToRemove = s.children.get(id)!;
    s.children.delete(id);
    s.viewportChildContainer.removeChild(childToRemove);
  });
};
